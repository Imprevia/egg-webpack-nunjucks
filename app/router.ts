import { Application } from 'egg';

export default (app: Application) => {
    // @ts-ignore
    const { controller, router } = app;
    router.get('/', controller.home.index);
};
