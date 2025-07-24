import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import api from './api'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import handleTree from '@/utils/common'
import AuthorityDirective from "@/permission/index";
// 工具类
import request from "@/utils/request"
import storage from '@/utils/storage'

// 全局样式
import './assets/css/global.css'

// 统一导入 el-icon 图标
import * as ElIconModules from '@element-plus/icons-vue'

// 创建 Vue 应用实例 ✅
const app = createApp(App)

// 统一注册 el-icon 图标组件 ✅
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}

// 挂载全局工具方法
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.config.globalProperties.$handleTree = handleTree
// 使用插件和模块
app.use(router)
app.use(store)
app.use(api)
app.use(ElementPlus)
app.use(handleTree)
AuthorityDirective.install(app)

// 挂载根组件
app.mount('#app')
