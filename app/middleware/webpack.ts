import { FileSystem } from "egg-webpack";
import * as path from "path";
export default () => {
  return async (ctx, next) => {
    // 开发环境从内存取出webpack打包的文件
    const fileSystem = new FileSystem(ctx.app);
    const fileContent = await fileSystem.readWebpackMemoryFile(
      path.join(__dirname, "../../config/manifest.json"),
      ""
    );
    ctx.app.locals.manifest = fileContent ? JSON.parse(fileContent) : {};
    await next();
  };
};
