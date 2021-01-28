const FileSystem = require("egg-webpack").FileSystem;
const path = require("path");
class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  async didReady() {
    // 应用已经启动完毕

    const ctx = await this.app.createAnonymousContext();

    if (this.app.config.env === "local") {
      // 开发环境从内存取出webpack打包的文件
      const fileSystem = new FileSystem(this.app);
      const fileContent = await fileSystem.readWebpackMemoryFile(
        path.join(__dirname, "./config/manifest.json"),
        ""
      );
      this.app.locals.manifest = fileContent ? JSON.parse(fileContent) : {};
    } else {
      this.app.locals.manifest = require("./config/manifest");
    }
  }
}
module.exports = AppBootHook;
