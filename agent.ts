import nacos from "./lib/nacos";

module.exports = (agent) => {
  if (agent.config.nacos) {
    nacos(agent.config.nacos, agent);
  }
};
