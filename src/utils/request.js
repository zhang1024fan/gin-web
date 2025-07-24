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
    baseURL: 'http://127.0.0.1:8000',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截
service.interceptors.request.use((req) => {
    const headers = req.headers
    const token = storage.getItem("token") || {}
    if(!headers.Authorization) {
        headers.Authorization = 'Bearer ' + token
    }
    // 调试日志 - 打印完整的请求配置
    console.group('Request Interceptor')
    console.log('Original URL:', req.url)
    console.log('Base URL:', service.defaults.baseURL)
    
    // 确保URL以/api/v1开头
    if (req.url && !req.url.startsWith('api/v1/')) {
        req.url = 'api/v1/' + (req.url.startsWith('/') ? req.url.substring(1) : req.url)
    }
    console.log('Processed URL:', req.url)
    
    // 构造完整URL
    const fullURL = service.defaults.baseURL + '/' + (req.url || '')
    console.log('Full URL:', fullURL)
    
    // 验证最终请求URL
    console.log('Final request URL:', req.baseURL + req.url)
    console.groupEnd()
    
    // 确保axios使用正确的URL
    req.url = req.url || ''
    req.baseURL = service.defaults.baseURL
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
    
    // 确保URL以/api/v1开头
    if (options.url && !options.url.startsWith('api/v1/')) {
        options.url = 'api/v1/' + (options.url.startsWith('/') ? options.url.substring(1) : options.url)
    }
    
    // 调试日志 - 打印请求配置
    console.log('Request config:', {
        url: options.url,
        method: options.method,
        baseURL: service.defaults.baseURL,
        fullPath: (service.defaults.baseURL || '') + '/' + (options.url || ''),
        params: options.params,
        data: options.data,
        headers: options.headers
    })
    return service(options).catch(error => {
        console.group('Request Error Details')
        console.log('Error config:', error.config)
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
        } else if (error.request) {
            console.error('No response received. Possible causes:')
            console.error('- Backend service not running')
            console.error('- Network connectivity issues')
            console.error('- CORS problems')
            console.error('Request details:', error.request)
        } else {
            console.error('Request setup error:', error.message)
        }
        console.groupEnd()
        return Promise.reject(error)
    })
}

export default request
