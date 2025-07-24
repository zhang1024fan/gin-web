import request from '@/utils/request'

export default {
    // 获取所有ECS凭据
    getEcsAuthList() {
        return request({
            url: 'config/ecsauthlist',
            method: 'get'
        })
    },
    // 根据名称查找凭据
    getEcsAuthByName(name) {
        return request({
            url: 'config/ecsauthinfo',
            method: 'get',
            params: { name }
        })
    },
    // 创建ECS凭据
    createEcsAuth(data) {
        return request({
            url: 'config/ecsauthadd',
            method: 'post',
            data: data
        })
    },
    // 更新ECS凭据
    updateEcsAuth(data) {
        return request({
            url: 'config/ecsauthupdate',
            method: 'put',
            data: data
        })
    },
    // 删除ECS凭据
    deleteEcsAuth(id) {
        return request({
            url: 'config/ecsauthdelete',
            method: 'delete',
            data: { id }
        })
    }
}
