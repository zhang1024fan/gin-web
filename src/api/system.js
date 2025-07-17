import request from "@/utils/request"

export default {
    // post岗位
    queryPostList(params) {
        return request({
            url: "/api/post/list",
            method: 'get',
            params: params
        })
    },
    batchDeleteSysPost(ids) {
        const data = {
            ids
        }
        return request({
            url: '/api/post/batch/delete',
            method: 'delete',
            data: data
        })
    },
    deleteSysPost(id) {
        const data = {
            id
        }
        return request({
            url: '/api/post/delete',
            method: 'delete',
            data: data
        })
    },
    querySysPostVoList() {
        return request({
            url: '/api/post/vo/list',
            method: 'get'
        })
    },
    addPost(data) {
        return request({
            url: '/api/post/add',
            method: 'post',
            data: data
        })
    },
    postInfo(id) {
        return request({
            url: '/api/post/info',
            method: 'get',
            params: { id }
        })
    },
    updatePost(data) {
        return request({
            url: '/api/post/update',
            method: 'put',
            data: data
        })
    },
    updatePostStatus(id, postStatus) {
        return request({
            url: "/api/post/updateStatus",
            method: 'put',
            data: {
                id,
                postStatus
            }
        })
    },
    // dept部门
    queryDeptList(params) {
        return request({
            url: "/api/dept/list",
            method: 'get',
            params: params
        })
    },
    querySysDeptVoList() {
        return request({
            url: '/api/dept/vo/list',
            method: 'get'
        })
    },
    addDept(data) {
        return request({
            url: '/api/dept/add',
            method: 'post',
            data: data
        })
    },
    deleteDept(id) {
        return request({
            url: '/api/dept/delete',
            method: 'delete',
            data: { id }
        })
    },
    deptInfo(id) {
        return request({
            url: '/api/dept/info',
            method: 'get',
            params: { id }
        })
    },
    deptUsers(id) {
        return request({
            url: `/api/dept/users`,
            method: 'get',
            params: { deptId: id }
        })
    },
    deptUpdate(data) {
        return request({
            url: '/api/dept/update',
            method: 'put',
            data: data
        })
    },
    // menu菜单
    queryMenuList(params) {
        return request({
            url: "/api/menu/list",
            method: 'get',
            params: params
        })
    },
    querySysMenuVoList() {
        return request({
            url: "/api/menu/vo/list",
            method: 'get'
        })
    },
    addMenu(data) {
        return request({
            url: '/api/menu/add',
            method: 'post',
            data: data
        })
    },
    menuInfo(id) {
        return request({
            url: '/api/menu/info',
            method: 'get',
            params: { id }
        })
    },
    menuUpdate(data) {
        return request({
            url: '/api/menu/update',
            method: 'put',
            data: data
        })
    },
    menuDelete(id) {
        return request({
            url: '/api/menu/delete',
            method: 'delete',
            data: { id }
        })
    },
    // role角色
    queryRoleList(params) {
        return request({
            url: "/api/role/list",
            method: 'get',
            params: params
        })
    },
    querySysRoleVoList() {
        return request({
            url: "/api/role/vo/list",
            method: 'get'
        })
    },
    addRole(data) {
        return request({
            url: '/api/role/add',
            method: 'post',
            data: data
        })
    },
    roleInfo(id) {
        return request({
            url: '/api/role/info',
            method: 'get',
            params: { id }
        })
    },
    roleUpdate(data) {
        return request({
            url: '/api/role/update',
            method: 'put',
            data: data
        })
    },
    deleteRole(id) {
        return request({
            url: '/api/role/delete',
            method: 'delete',
            data: { id }
        })
    },
    updateRoleStatus(id, status) {
        return request({
            url: "/api/role/updateStatus",
            method: 'put',
            data: {
                id,
                status
            }
        })
    },
    QueryRoleMenuIdList(id) {
        return request({
            url: "/api/role/vo/idList",
            method: 'get',
            params: { id }
        })
    },
    AssignPermissions(id, menuIds) {
        return request({
            url: "/api/role/assignPermissions",
            method: 'put',
            data: {
                id,
                menuIds
            }
        })
    },
    // admin用户
    queryAdminList(params) {
        return request({
            url: "/api/admin/list",
            method: 'get',
            params: params
        })
    },
    updateAdminStatus(id, status) {
        return request({
            url: "/api/admin/updateStatus",
            method: 'put',
            data: {
                id,
                status
            }
        })
    },
    addAdmin(data) {
        return request({
            url: '/api/admin/add',
            method: 'post',
            data: data
        })
    },
    adminInfo(id) {
        return request({
            url: '/api/admin/info',
            method: 'get',
            params: { id }
        })
    },
    adminUpdate(data) {
        return request({
            url: '/api/admin/update',
            method: 'put',
            data: data
        })
    },
    resetPassword(id, password) {
        return request({
            url: '/api/admin/updatePassword',
            method: 'put',
            data: {
                id,
                password
            }
        })
    },
    deleteAdmin(id) {
        return request({
            url: '/api/admin/delete',
            method: 'delete',
            data: { id }
        })
    },
    adminUpdatePersonal(data) {
        return request({
            url: '/api/admin/updatePersonal',
            method: 'put',
            data: data
        })
    },
    adminUpdatePersonalPassword(data) {
        return request({
            url: '/api/admin/updatePersonalPassword',
            method: 'put',
            data: data
        })
    },
    // sysLoginInfo登录日志
    querySysLoginInfoList(params) {
        return request({
            url: "/api/sysLoginInfo/list",
            method: 'get',
            params: params
        })
    },
    batchDeleteSysLoginInfo(ids) {
        return request({
            url: '/api/sysLoginInfo/batch/delete',
            method: 'delete',
            data: { ids }
        })
    },
    cleanSysLoginInfo() {
        return request({
            url: '/api/sysLoginInfo/clean',
            method: 'delete'
        })
    },
    deleteSysLoginInfo(id) {
        return request({
            url: '/api/sysLoginInfo/delete',
            method: 'delete',
            data: { id }
        })
    },
    // SysOperationLog操作日志
    querySysOperationLogList(params) {
        return request({
            url: "/api/sysOperationLog/list",
            method: 'get',
            params: params
        })
    },
    batchDeleteSysOperationLog(ids) {
        return request({
            url: '/api/sysOperationLog/batch/delete',
            method: 'delete',
            data: { ids }
        })
    },
    cleanSysOperationLog() {
        return request({
            url: '/api/sysOperationLog/clean',
            method: 'delete'
        })
    },
    deleteSysOperationLog(id) {
        return request({
            url: '/api/sysOperationLog/delete',
            method: 'delete',
            data: { id }
        })
    }
}
