/**
 * axios统一封装
 *
 * @author xiaoRui
 *
 */
import { Message } from 'element-plus'
import axios from 'axios'
import router from "@/router/router"
import storage from "./storage"

// 创建axios对象，添加全局配置
const service = axios.create({
    baseURL: '', // 强制设置为空字符串
    timeout: 8000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// 请求拦截
service.interceptors.request.use((req) => {
    const headers = req.headers
    const token = storage.getItem("token") || {}
    if(!headers.Authorization) {
        headers.Authorization = 'Bearer ' + token
    }
    // 强制使用相对路径
    if (req.url && !req.url.startsWith('/')) {
        req.url = '/' + req.url
    }
    // 确保API请求以/api开头
    if (req.url && !req.url.startsWith('/api')) {
        req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url
    }
    return req
})

// 响应拦截
service.interceptors.response.use((res) => {
    const {code, data, message} = res.data
    if (code === 403) {
        Message.error(message)
        setTimeout(()=> {
            storage.clearAll()
            router.push('/login')
        }, 1500)
    } else if (code === 406) {
        Message.error(message)
        setTimeout(() => {
            storage.clearAll()
            router.push('/login')
        }, 1500)
    } else {
        return res
    }
})

// 请求核心函数
function request(options) {
    options.method = options.method || 'get'
    
    // 统一处理GET请求参数
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data || options.params
    }
    
    // 调试日志 - 打印请求配置
    console.log('Request config:', {
        url: options.url,
        method: options.method,
        baseURL: service.defaults.baseURL,
        fullPath: (service.defaults.baseURL || '') + (options.url || ''),
        params: options.params,
        data: options.data,
        headers: options.headers
    })
    return service(options).catch(error => {
        if (error.response) {
            // 请求已发出但服务器响应状态码不在 2xx 范围内
            console.error('API Error:', error.response.status, error.response.data)
        } else if (error.request) {
            // 请求已发出但没有收到响应
            console.error('No response received:', error.request)
        } else {
            // 发送请求时出错
            console.error('Request error:', error.message)
        }
        return Promise.reject(error)
    })
}

export default request
