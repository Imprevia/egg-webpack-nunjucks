import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    },
    static: true,
};

export default plugin;
