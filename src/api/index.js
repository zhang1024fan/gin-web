/**
 * 基础API接口管理
 *
 * @author xiaoRui
 */

import request from "@/utils/request"
import systemAPI from './system'
import cmdbAPI from './cmdb'

export default {
    // 基础API
    captcha() {
        return request({
            url: "/api/captcha",
            method: 'get'
        })
    },
    login(params) {
        return request({
            url: "/api/login",
            method: 'post',
            data: params
        })
    },
    // 系统管理API
    ...systemAPI,
    // CMDB管理API
    ...cmdbAPI
}
