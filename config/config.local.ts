import { EggAppConfig, PowerPartial } from "egg";

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  const webpackConfig = require("../build/webpack.config.js");
  config.webpack = {
    webpackConfigList: [webpackConfig(process.argv, { mode: "development" })],
  };

  config.middleware = ["webpack"];

  return config;
};
