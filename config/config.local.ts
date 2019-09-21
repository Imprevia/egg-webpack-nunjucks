import { EggAppConfig, PowerPartial } from 'egg';

const Constants = require('./constants.js');
export default () => {
    const config: PowerPartial<EggAppConfig> = {};
    config.static = {
        maxAge: 0, // maxAge 缓存，默认 1 年
    };

    const webpackConfig = require('../webpack.config.js');
    config.webpack = {
        webpackConfigList: [ webpackConfig(null, { mode: 'development' }) ],
    };
    config.domainJson = Constants.local;
    return config;
};
