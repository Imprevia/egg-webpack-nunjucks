import { Application } from "egg";

export default (app: Application) => {
  const { controller, router } = app;

  // 首页
  router.get("/", controller.home.index);
};
