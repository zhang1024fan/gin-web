import request from "@/utils/request"

export default {
    // cmdb业务分组
    createCmdbGroup(data) {
        return request({
            url: 'cmdb/groupadd',
            method: 'post',
            data: data
        })
    },
    getAllCmdbGroups() {
        return request({
            url: 'cmdb/grouplist',
            method: 'get'
        })
    },
    getCmdbGroupByName(name) {
        return request({
            url: 'cmdb/groupbyname',
            method: 'get',
            params: {
                name: name
            }
        })
    },
    updateCmdbGroup(data) {
        return request({
            url: 'cmdb/groupupdate',
            method: 'put',
            data: data
        })
    },
    deleteCmdbGroup(id) {
        const data = {
            id
        }
        return request({
            url: 'cmdb/groupdelete',
            method: 'delete',
            data: data
        })
    },

    // 主机管理
    createCmdbHost(data) {
        return request({
            url: 'cmdb/hostcreate',
            method: 'post',
            data: data
        })
    },
    updateCmdbHost(data) {
        return request({
            url: 'cmdb/hostupdate',
            method: 'put',
            data: data
        })
    },
    deleteCmdbHost(id) {
        return request({
            url: 'cmdb/hostdelete',
            method: 'delete',
            data: { id }
        })
    },
    getCmdbHostList(params) {
        // 确保参数名与后端API一致
        const queryParams = {
            page: params.page || 1,
            pageSize: params.pageSize || 10
        }
        
        // 添加搜索条件，确保参数名与后端API一致
        if (params.name) queryParams.name = params.name
        if (params.ip) queryParams.ip = params.ip
        if (params.status) queryParams.status = params.status
        if (params.groupId) queryParams.groupId = params.groupId

        console.log('最终API查询参数:', JSON.stringify(queryParams, null, 2))
        return request({
            url: 'cmdb/hostlist',
            method: 'get',
            params: queryParams
        })
    },
    getCmdbHostById(id) {
        return request({
            url: 'cmdb/hostinfo',
            method: 'get',
            params: { id }
        })
    },
    getCmdbHostsByGroupId(groupId) {
        return request({
            url: 'cmdb/hostgroup',
            method: 'get',
            params: { groupId }
        })
    },
    GetCmdbHostsByHostNameLike(hostName, params) {
        return request({
            url: '/cmdb/hostbyname',
            method: 'get',
            params: { 
                name: hostName,
                ...params
            }
        })
    },
    GetCmdbHostsByIP(ip, params) {
        return request({
            url: 'cmdb/hostbyip',
            method: 'get',
            params: { 
                ip,
                ...params
            }
        })
    },
    GetCmdbHostsByStatus(status, params) {
        return request({
            url: 'cmdb/hostbystatus',
            method: 'get',
            params: { 
                status,
                ...params
            }
        })
    },
    getCmdbHostsByGroupId(groupId, params) {
        return request({
            url: 'cmdb/hostgroup',
            method: 'get',
            params: {
                groupId,
                ...params
            }
        })
    },
    hostcloudcreatealiyun(data) {
        return request({
            url: 'cmdb/hostcloudcreatealiyun',
            method: 'post',
            data: data
        })
    },
    hostcloudcreatetencent(data) {
        return request({
            url: 'cmdb/hostcloudcreatetencent',
            method: 'post',
            data: data
        })
    },
    
    // 获取带主机列表的分组数据
    getGroupListWithHosts() {
        return request({
            url: 'cmdb/grouplistwithhosts',
            method: 'get'
        })
    },

    // WebSocket连接
    getHostSSHWebSocketUrl(hostId) {
        return `ws://127.0.0.1:8000/api/v1/cmdb/hostssh/connect/${hostId}`
    }
}
