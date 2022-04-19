import { EggAppConfig, PowerPartial } from "egg";

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  const webpackConfig = require("../build/webpack.config.js");
  config.webpack = {
    webpackConfigList: [webpackConfig(process.argv, { mode: "development" })],
  };

  config.middleware = ["webpack"];
  config.nacos = {
    serviceName: "cloud-consumer-order-web",
    serverAddress: "172.18.0.2:30000",
    namespase: "public",
  };
  return config;
};
