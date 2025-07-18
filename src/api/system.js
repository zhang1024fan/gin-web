import request from "@/utils/request"

export default {
    // post岗位
    queryPostList(params) {
        return request({
            url: 'post/list',
            method: 'get',
            params: params
        })
    },
    batchDeleteSysPost(ids) {
        const data = {
            ids
        }
        return request({
            url: 'post/batch/delete',
            method: 'delete',
            data: data
        })
    },
    deleteSysPost(id) {
        const data = {
            id
        }
        return request({
            url: 'post/delete',
            method: 'delete',
            data: data
        })
    },
    querySysPostVoList() {
        return request({
            url: 'post/vo/list',
            method: 'get'
        })
    },
    addPost(data) {
        return request({
            url: 'post/add',
            method: 'post',
            data: data
        })
    },
    postInfo(id) {
        return request({
            url: 'post/info',
            method: 'get',
            params: { id }
        })
    },
    updatePost(data) {
        return request({
            url: 'post/update',
            method: 'put',
            data: data
        })
    },
    updatePostStatus(id, postStatus) {
        return request({
            url: 'post/updateStatus',
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
            url: 'dept/list',
            method: 'get',
            params: params
        })
    },
    querySysDeptVoList() {
        return request({
            url: 'dept/vo/list',
            method: 'get'
        })
    },
    addDept(data) {
        return request({
            url: 'dept/add',
            method: 'post',
            data: data
        })
    },
    deleteDept(id) {
        return request({
            url: 'dept/delete',
            method: 'delete',
            data: { id }
        })
    },
    deptInfo(id) {
        return request({
            url: 'dept/info',
            method: 'get',
            params: { id }
        })
    },
    deptUsers(id) {
        return request({
            url: 'dept/users',
            method: 'get',
            params: { deptId: id }
        })
    },
    deptUpdate(data) {
        return request({
            url: 'dept/update',
            method: 'put',
            data: data
        })
    },
    // menu菜单
    queryMenuList(params) {
        return request({
            url: 'menu/list',
            method: 'get',
            params: params
        })
    },
    querySysMenuVoList() {
        return request({
            url: 'menu/vo/list',
            method: 'get'
        })
    },
    addMenu(data) {
        return request({
            url: 'menu/add',
            method: 'post',
            data: data
        })
    },
    menuInfo(id) {
        return request({
            url: 'menu/info',
            method: 'get',
            params: { id }
        })
    },
    menuUpdate(data) {
        return request({
            url: 'menu/update',
            method: 'put',
            data: data
        })
    },
    menuDelete(id) {
        return request({
            url: 'menu/delete',
            method: 'delete',
            data: { id }
        })
    },
    // role角色
    queryRoleList(params) {
        return request({
            url: 'role/list',
            method: 'get',
            params: params
        })
    },
    querySysRoleVoList() {
        return request({
            url: 'role/vo/list',
            method: 'get'
        })
    },
    addRole(data) {
        return request({
            url: 'role/add',
            method: 'post',
            data: data
        })
    },
    roleInfo(id) {
        return request({
            url: 'role/info',
            method: 'get',
            params: { id }
        })
    },
    roleUpdate(data) {
        return request({
            url: 'role/update',
            method: 'put',
            data: data
        })
    },
    deleteRole(id) {
        return request({
            url: 'role/delete',
            method: 'delete',
            data: { id }
        })
    },
    updateRoleStatus(id, status) {
        return request({
            url: 'role/updateStatus',
            method: 'put',
            data: {
                id,
                status
            }
        })
    },
    QueryRoleMenuIdList(id) {
        return request({
            url: 'role/vo/idList',
            method: 'get',
            params: { id }
        })
    },
    AssignPermissions(id, menuIds) {
        return request({
            url: 'role/assignPermissions',
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
            url: 'admin/list',
            method: 'get',
            params: params
        })
    },
    updateAdminStatus(id, status) {
        return request({
            url: 'admin/updateStatus',
            method: 'put',
            data: {
                id,
                status
            }
        })
    },
    addAdmin(data) {
        return request({
            url: 'admin/add',
            method: 'post',
            data: data
        })
    },
    adminInfo(id) {
        return request({
            url: 'admin/info',
            method: 'get',
            params: { id }
        })
    },
    adminUpdate(data) {
        return request({
            url: 'admin/update',
            method: 'put',
            data: data
        })
    },
    resetPassword(id, password) {
        return request({
            url: 'admin/updatePassword',
            method: 'put',
            data: {
                id,
                password
            }
        })
    },
    deleteAdmin(id) {
        return request({
            url: 'admin/delete',
            method: 'delete',
            data: { id }
        })
    },
    adminUpdatePersonal(data) {
        return request({
            url: 'admin/updatePersonal',
            method: 'put',
            data: data
        })
    },
    adminUpdatePersonalPassword(data) {
        return request({
            url: 'admin/updatePersonalPassword',
            method: 'put',
            data: data
        })
    },
    // sysLoginInfo登录日志
    querySysLoginInfoList(params) {
        return request({
            url: 'sysLoginInfo/list',
            method: 'get',
            params: params
        })
    },
    batchDeleteSysLoginInfo(ids) {
        return request({
            url: 'sysLoginInfo/batch/delete',
            method: 'delete',
            data: { ids }
        })
    },
    cleanSysLoginInfo() {
        return request({
            url: 'sysLoginInfo/clean',
            method: 'delete'
        })
    },
    deleteSysLoginInfo(id) {
        return request({
            url: 'sysLoginInfo/delete',
            method: 'delete',
            data: { id }
        })
    },
    // SysOperationLog操作日志
    querySysOperationLogList(params) {
        return request({
            url: 'sysOperationLog/list',
            method: 'get',
            params: params
        })
    },
    batchDeleteSysOperationLog(ids) {
        return request({
            url: 'sysOperationLog/batch/delete',
            method: 'delete',
            data: { ids }
        })
    },
    cleanSysOperationLog() {
        return request({
            url: 'sysOperationLog/clean',
            method: 'delete'
        })
    },
    deleteSysOperationLog(id) {
        return request({
            url: 'sysOperationLog/delete',
            method: 'delete',
            data: { id }
        })
    }
}
