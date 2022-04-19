const { NacosNamingClient } = require("nacos");
import { address } from "ip";

function createClient(config, agent) {
  const { logger } = agent;
  logger.info("[nacos] 注册SSR-Nacos服务");
  // 动态获取 IP 地址
  const ipAddr = address();
  // 我们当前应用的端口号
  const port = agent.config.cluster.listen.port;

  // 服务名称，后面消费方调用的时候通过这个服务名进行服务查询。
  const providerServiceName = config.serviceName;
  // nacos服务地址
  const nacosServerAddress = config.serverAddress;
  // namespace: 名称空间必须在服务器上存在
  const providerNamespase = config.namespase;
  const Client = NacosNamingClient;
  const client = new Client({
    logger,
    serverList: nacosServerAddress,
    namespace: providerNamespase,
  });

  agent.beforeStart(async () => {
    try {
      await client.ready();
      await client.registerInstance(providerServiceName, {
        ip: ipAddr,
        port,
      });
      // 这里也可以传入group，不传默认就是 DEFAULT_GROUP
      // const groupName = 'nodejs';
      // await client.registerInstance(providerServiceName, {
      // ip: ipAddr,
      // port
      // }, groupName);
      logger.info(`[nacos] 注册成功: ${ipAddr}:${port}`);
      const payment = await client.getAllInstances("cloud-payment-service");
      logger.info(
        `[nacos-getAllInstances] cloud-payment-service: ${JSON.stringify(
          payment
        )}`
      );
      const select = await client.selectInstances("cloud-payment-service");
      logger.info(
        `[nacos-selectInstances] cloud-payment-service: ${JSON.stringify(
          select
        )}`
      );
      client.subscribe("cloud-payment-service", function (data) {
        logger.info(
          `[nacos-subscribe] cloud-payment-service: ${JSON.stringify(data)}`
        );
      });
    } catch (err) {
      logger.error("[nacos] 注册失败: " + err.toString());
    }
  });

  agent.beforeClose(async () => {
    try {
      await client.close();
      await client.deregisterInstance(providerServiceName, {
        ip: ipAddr,
        port,
      });
      logger.info(`[nacos] 注销成功: ${ipAddr}:${port}`);
    } catch (err) {
      logger.error("[nacos] 注销失败: " + err.toString());
    }
  });
}
export default createClient;
