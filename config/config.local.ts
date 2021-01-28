import { EggAppConfig, PowerPartial } from "egg";

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  const webpackConfig = require("../webpack.config.js");
  config.webpack = {
    webpackConfigList: [webpackConfig(null, { mode: "development" })],
  };

  config.middleware = ["webpack"];

  return config;
};
