import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // 首页
  router.get('/', controller.home.index);
  // manifest 静态资源字典
  router.get('/config/manifest.js', controller.config.manifest);
};
