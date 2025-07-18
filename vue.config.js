/**
 * vue配置中心
 */
const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  lintOnSave: false,   // 关闭校验
  productionSourceMap: false, // 关闭生产环境sourceMap
  publicPath:"/",
  configureWebpack: {},
  outputDir: "dist",
  assetsDir: "static",
  devServer: {
    port: 8080, //前端服务启动的端口
    host: "0.0.0.0",
    https: false,
    open:false,
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        pathRewrite: {
          '^/api/v1': ''
        }
      }
    },
    client: {
      overlay: false  // 关闭全屏错误提示
    }
  }
})
