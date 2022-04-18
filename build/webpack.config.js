const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const SpritesmithPlugin = require("webpack-spritesmith");
const _ = require("lodash");
const WebpackBar = require("webpackbar");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const DelBuildCssGenerateJsWebpackPlugin = require("./del-build-css-generate-js-webpack-plugin");

const baseDir = path.resolve("./");

// 生成webpack entry的json数据
function getEntry(globPath) {
  const files = glob.sync(globPath);
  let entries = {},
    entry,
    dirname,
    basename,
    pathname,
    extname;

  for (let i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    let key = pathname.split(/entry[\\/]/)[1].replace("scss", "css");
    if (!entries[key]) {
      entries[key] = [];
    }
    entries[key].push(entry);
  }
  return entries;
}

const entityPath = path.join(baseDir, "./app/public/entry");
const distPath = path.join(baseDir, "./app/public/dist");
const entries = getEntry(entityPath + "/**/!(_)*.@(js|scss)");

function getReport(env) {
  try {
    const str = env["report"];
    return !!str;
  } catch (e) {
    // console.error(e);
    return false;
  }
}

module.exports = (env, argv) => {
  const mode = argv.mode;
  let plugins = [];
  let distName = "[name]";
  let chunkName = "chunk";
  if (argv.mode === "development") {
    // 开发环境

    // 热模块更新
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    // 生产环境

    distName += ".[contenthash:5]";
    chunkName += ".[contenthash:5]";
    // 压缩单独的css文件
    plugins.push(new OptimizeCSSAssetsPlugin()); // 压缩css
  }

  // 打包进度条
  plugins.push(new WebpackBar());

  if (getReport(env)) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  // 全局变量
  plugins.push(
    new webpack.DefinePlugin({
      "process.env": mode,
      IS_DEV: JSON.stringify(argv.mode === "development"),
    })
  );

  // 删除之前打包的文件
  plugins.push(new CleanWebpackPlugin());

  //  CSS样式抽离
  plugins.push(
    new MiniCssExtractPlugin({
      filename: distName + ".css",
      chunkFilename: distName + ".css",
    })
  );

  // 雪碧图
  plugins.push(
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(baseDir, "app/public/images/icon"),
        glob: "*.png",
      },
      spritesmithOptions: {
        padding: 8,
      },
      target: {
        image: path.resolve(baseDir, "app/public/images/icon-sprites.png"),
        css: [
          [
            path.resolve(baseDir, "app/public/entry/scss/_icon.scss"),
            {
              format: "handlebars_based_template",
            },
          ],
        ],
      },
      apiOptions: {
        //css 引入雪碧图的路径。根目录：/ => public
        cssImageRef: `../../images/icon-sprites.png?t=${Date.now()}`,
      },
      customTemplates: {
        handlebars_based_template: "./build/scss.template.handlebars",
      },
    })
  );

  // 生成manifest，Egg读取manifest，获取打包后的带hash的文件
  plugins.push(
    new WebpackManifestPlugin({
      fileName: path.join(baseDir, "./config/manifest.json"),
    })
  );

  plugins.push(
    new DelBuildCssGenerateJsWebpackPlugin({ path: `${distPath}/css`, mode })
  );

  const config = {
    entry: entries,
    mode: argv.mode,
    plugins: plugins,
    output: {
      filename: distName + ".js",
      path: path.resolve(baseDir, distPath),
      publicPath: "/public/dist/",
      chunkFilename: chunkName + ".js",
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, // CSS样式抽离
            {
              loader: "css-loader",
              options: {
                url: false,
              },
            },
            "postcss-loader", // 添加css前缀
            "sass-loader",
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: [path.resolve(baseDir, entityPath)],
          loader: "babel-loader",
        },
      ],
    },
  };

  if (getReport(env)) {
    const smp = new SpeedMeasurePlugin();
    return smp.wrap(config);
  }
  return config;
};
