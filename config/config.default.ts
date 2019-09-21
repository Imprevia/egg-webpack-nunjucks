import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';
import * as fs from 'fs';
export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1557722381562_3622';

    // add your egg config in here
    config.middleware = [];

    config.nunjucks = {
        trimBlocks: true,
        lstripBlocks: true,
    };

    config.siteFile = {
        '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/images/favicon.ico'))
    };

    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.njk': 'nunjucks',
            '.html': 'nunjucks',
        },
    };

    config.static = {
        dir: path.join(appInfo.baseDir, 'app/public'),
        prefix: '/public/',
    };

    return {
        ...config,
    };
};
