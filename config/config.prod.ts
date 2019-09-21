import { EggAppConfig, PowerPartial } from 'egg';
const Constants = require('./constants.js');

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    config.domainJson = Constants.prod;
    return config;
};
