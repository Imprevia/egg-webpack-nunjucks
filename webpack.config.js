const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const SpritesmithPlugin = require("webpack-spritesmith");
const _ = require("lodash");

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
    entries[key].push("./" + entry);
  }
  return entries;
}

const entityPath = "./app/public/entry";
const distPath = "./app/public/dist";

const entries = getEntry(entityPath + "/**/!(_)*.@(js|scss)");

module.exports = (env, argv) => {
  const mode = argv.mode;
  let plugins = [];
  let distName = "[name]";
  if (argv.mode === "development") {
    // 开发环境

    // 热模块更新
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    // 生产环境

    distName += ".[hash:5]";
    // 压缩单独的css文件
    plugins.push(new OptimizeCSSAssetsPlugin()); // 压缩css
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
        cwd: path.resolve(__dirname, "app/public/images/icon"),
        glob: "*.png",
      },
      spritesmithOptions: {
        padding: 8,
      },
      target: {
        image: path.resolve(__dirname, "app/public/images/icon-sprites.png"),
        css: [
          [
            path.resolve(__dirname, "app/public/entry/scss/_icon.scss"),
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
        handlebars_based_template: "./scss.template.handlebars",
      },
    })
  );

  // 生成manifest，Egg读取manifest，获取打包后的带hash的文件
  plugins.push(
    new WebpackManifestPlugin({
      fileName: path.join(__dirname, "./config/manifest.json"),
    })
  );

  const config = {
    entry: entries,
    mode: argv.mode,
    plugins: plugins,
    output: {
      filename: distName + ".js",
      path: path.resolve(__dirname, distPath),
      publicPath: "/public/dist/",
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: "common.lib",
            chunks: "initial", // initial表示提取入口文件的公共css及js部分
            minChunks: 2, // 表示提取公共部分最少的文件数
            minSize: 0, // 表示提取公共部分最小的大小
            // 如果发现页面中未引用公共文件，加上enforce: true
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
          include: [path.resolve(__dirname, entityPath)],
          loader: "babel-loader",
        },
      ],
    },
  };

  return config;
};
