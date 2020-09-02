const path = require("path");
const fs = require("fs");
function resolve(dir) {
  return path.join(__dirname, dir);
}

var packages = fs.readdirSync('./src/packages')

module.exports = {
  // lintOnSave: process.env.NODE_ENV !== "production",
  lintOnSave: false,
  chainWebpack: config => {
    packages.forEach(item => {
      config.resolve.alias
        .set(`@mikefeng110808/${item}$`, resolve(`src/packages/${item}/src`))
    }) 
  },
  configureWebpack: () => ({
    optimization: {
      splitChunks: {
        chunks: "async",
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3
      }
    }
  }),
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  productionSourceMap: false,
  pages: {
    index: {
      entry: "src/main.ts",
      template: "public/index.html",
      filename: "index.html",
      title: "index",
      favicon: "public/favicon.ico"
    }
  },
  runtimeCompiler: true,
  devServer: {
    port: "8080"
    // "proxy": {
    //   "/any800/": {
    //     "target": "http://jk.demo.xiaoi.net",
    //     "changeOrigin": true
    //   }
    // }
  },
  lintOnSave: true
};