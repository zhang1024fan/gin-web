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
}
}
