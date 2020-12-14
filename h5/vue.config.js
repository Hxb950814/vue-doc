const path = require("path");
const webpack = require("webpack");
const chalk = require("chalk");
const { getConfig } = require('fushui-common/scripts/env');
//
// const FileManagerPlugin = require('filemanager-webpack-plugin');
// const WebpackCdnPlugin = require('webpack-cdn-plugin');
// //
const git = require("./build/git");
const buildConfig = require("./build/build_config"); // 打包配置
//
const isProdEnv = process.env.NODE_ENV === "production";
const isDevEnv = process.env.NODE_ENV === "development";
//
const runConf = getConfig("h5", process.env.NODE_ENV);
//
const runEnv = runConf.API_ENV; // api环境
const runPort = runConf.PORT; // 运行端口
const apiProxyPath = runConf["API_PATH_" + runEnv] || runConf.API_PATH; // API代理到端口
// 注入
// process.env.APU = '1';
// console.log(process.env.APU);

if (isDevEnv) {
  console.log(
    chalk.green(
      `正在【开发模式】下启动 ,当前API接口环境：【${
        ["未知环境", "本地环境", "测试环境", "正式环境"][runEnv]
      }】`
    )
  );
  console.log(`API代理到：${apiProxyPath}`);
} else if (isProdEnv) {
  console.log(chalk.green("正在【生产模式】下编译"));
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    if (isProdEnv) {
      config.optimization.minimize(true); // 最小化代码
      config.optimization.splitChunks({
        // 切割代码
        chunks: "all"
      });
    }
    config.resolve.alias
      .set("@common", path.resolve(__dirname, "./../fushui-common"))
      .set("@", path.resolve(__dirname, "src"))

      .set("@root", path.resolve(__dirname, "./../"))
      .set("@assets", path.resolve("src/assets"))
      .set("@components", path.resolve("src/components"));
  },
  css: {
    extract: isProdEnv,
    sourceMap: !isProdEnv,
    loaderOptions: {
      sass: {
        prependData:
          '@import "@/assets/style/variables.scss";@import "@/assets/style/helper.scss";'
      },
      postcss: {
        plugins: [
          require('postcss-px2rem')({ //配置项，详见官方文档
            remUnit: 75
          }) // 换算的基数
        ]
      }
    }
  },
  configureWebpack: {
    externals: {
      Aliplayer: "aliplayer"
    },
    devtool: false,
    plugins: (() => {
      const pluginsList = [new webpack.SourceMapDevToolPlugin({})];
      if (isProdEnv) {
        // console.log('git地址:', git.getCurrentBranchName());
        const branchName = git.getCurrentBranchName();
        console.log(chalk.green("当前打包分支:", branchName));
      }
      // // 添加 version 标志
      // pluginsList.push(
      //   new webpack.DefinePlugin({
      //     BUILD_VERSION: buildConfig.version
      //   })
      // );
      //
      // pluginsList.push(new ReplacePlugins());
      return pluginsList;
    })(),
    optimization: {
      minimizer: []
    }
  },
  devServer: {
    // 代理到端口
    port: runPort,
    proxy: {
      "/api/": {
        pathRewrite: { "^/api": "" },
        ws: false,
        target: apiProxyPath,
        changeOrigin: true
      }
    }
  }
};
