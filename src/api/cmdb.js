import request from "@/utils/request"

export default {
    // cmdb业务分组
    createCmdbGroup(data) {
        return request({
            url: '/api/cmdb/groupadd',
            method: 'post',
            data: data
        })
    },
    getAllCmdbGroups() {
        return request({
            url: '/api/cmdb/grouplist',
            method: 'get'
        })
    },
    getCmdbGroupByName(name) {
        return request({
            url: '/api/cmdb/groupbyname',
            method: 'get',
            params: {
                name: name
            }
        })
    },
    updateCmdbGroup(data) {
        return request({
            url: '/api/cmdb/groupupdate',
            method: 'put',
            data: data
        })
    },
    deleteCmdbGroup(id) {
        const data = {
            id
        }
        return request({
            url: '/api/cmdb/groupdelete',
            method: 'delete',
            data: data
        })
    }
}
