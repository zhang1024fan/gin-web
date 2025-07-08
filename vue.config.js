/**
 * vue配置中心
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,   // 关闭校验
  productionSourceMap: false, // 关闭生产环境sourceMap
  publicPath:"/",
  outputDir: "dist",
  assetsDir: "static",
  devServer: {
    port: 8080, //前端服务启动的端口
    host: "0.0.0.0",
    https: false,
    open:false,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", //后端api 地址
        changeOrigin: true,  // 是否跨域
      }
    },
    client: {
      overlay: false  // 关闭全屏错误提示
    }
  }
})
