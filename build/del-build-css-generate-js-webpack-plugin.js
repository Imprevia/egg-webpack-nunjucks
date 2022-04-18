const rimraf = require("rimraf");

class DelBuildCssGenerateJsWebpackPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const opt = this.options;
    compiler.hooks.done.tapAsync(
      "DelBuildCssGenerateJsWebpackPlugin",
      (compilation, call) => {
        if (opt.mode === "production") {
          rimraf.sync(`${opt.path}/*.js`, { glob: {} });
          console.log("删除打包css生成的js");
        }
        call();
      }
    );
  }
}
module.exports = DelBuildCssGenerateJsWebpackPlugin;
