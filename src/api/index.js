/**
 * 后端api接口统一管理
 *
 * @author xiaoRui
 */

import request from "@/utils/request"

export default {
    // 验证码接口
    captcha() {
        return request({
            url: "/captcha",
            method: 'get'
        })
    },
    // 登录接口
    login(params) {
        return request({
            url: "/login",
            method: 'post',
            data: params
        })
    },
    // post岗位
    queryPostList(params) {
        return request({
            url: "/post/list",
            method: 'get',
            data: params
        })
    },
    batchDeleteSysPost(ids) {
        const data = {
            ids
        }
        return request({
            url: '/post/batch/delete',
            method: 'delete',
            data: data
        })
    },
    deleteSysPost(id) {
        const data = {
            id
        }
        return request({
            url: '/post/delete',
            method: 'delete',
            data: data
        })
    },
    querySysPostVoList() {
        return request({
            url: '/post/vo/list',
            method: 'get'
        })
    },
    addPost(data) {
        return request({
            url: '/post/add',
            method: 'post',
            data: data
        })
    },
    postInfo(id) {
        const data = {
            id
        }
        return request({
            url: '/post/info',
            method: 'get',
            data: data
        })
    },
    updatePost(data) {
        return request({
            url: '/post/update',
            method: 'put',
            data: data
        })
    },
    updatePostStatus(id, postStatus) {
        const data = {
            id,
            postStatus
        }
        return request({
            url: "/post/updateStatus",
            method: 'put',
            data: data
        })
    },
    // dept部门
    queryDeptList(params) {
        return request({
            url: "/dept/list",
            method: 'get',
            data: params
        })
    },
    querySysDeptVoList() {  // 部门列表接口
        return request({
            url: '/dept/vo/list',
            method: 'get'
        })
    },
    addDept(data) {
        return request({
            url: '/dept/add',
            method: 'post',
            data: data
        })
    },
    deleteDept(id) {
        const data = {
            id
        }
        return request({
            url: '/dept/delete',
            method: 'delete',
            data: data
        })
    },
    deptInfo(id) {  // 部门信息接口
        const data = {
            id
        }
        return request({
            url: '/dept/info',
            method: 'get',
            data: data
        })
    },
    deptUsers(id) {
        return request({
            url: `/dept/users?deptId=${id}`,
            method: 'get'
        })
    },
    deptUpdate(data) {
        return request({
            url: '/dept/update',
            method: 'put',
            data: data
        })
    },
    // menu菜单
    queryMenuList(params) {
        return request({
            url: "/menu/list",
            method: 'get',
            data: params
        })
    },
    querySysMenuVoList() {
        return request({
            url: "/menu/vo/list",
            method: 'get'
        })
    },
    addMenu(data) {
        return request({
            url: '/menu/add',
            method: 'post',
            data: data
        })
    },
    menuInfo(id) {
        const data = {
            id
        }
        return request({
            url: '/menu/info',
            method: 'get',
            data: data
        })
    },
    menuUpdate(data) {
        return request({
            url: '/menu/update',
            method: 'put',
            data: data
        })
    },
    menuDelete(id) {
        const data = {
            id
        }
        return request({
            url: '/menu/delete',
            method: 'delete',
            data: data
        })
    },
    // role角色
    queryRoleList(params) {
        return request({
            url: "/role/list",
            method: 'get',
            data: params
        })
    },
    querySysRoleVoList() {
        return request({
            url: "/role/vo/list",
            method: 'get'
        })
    },
    addRole(data) {
        return request({
            url: '/role/add',
            method: 'post',
            data: data
        })
    },
    roleInfo(id) {
        const data = {
            id
        }
        return request({
            url: '/role/info',
            method: 'get',
            data: data
        })
    },
    roleUpdate(data) {
        return request({
            url: '/role/update',
            method: 'put',
            data: data
        })
    },
    deleteRole(id) {
        const data = {
            id
        }
        return request({
            url: '/role/delete',
            method: 'delete',
            data: data
        })
    },
    updateRoleStatus(id, status) {
        const data = {
            id,
            status
        }
        return request({
            url: "/role/updateStatus",
            method: 'put',
            data: data
        })
    },
    QueryRoleMenuIdList(id) {
        const data = {
            id
        }
        return request({
            url: "/role/vo/idList",
            method: 'get',
            data: data
        })
    },
    AssignPermissions(id, menuIds) {
        const data = {
            id,
            menuIds
        }
        return request({
            url: "/role/assignPermissions",
            method: 'put',
            data: data
        })
    },
    // admin用户
    queryAdminList(params) {
        return request({
            url: "/admin/list",
            method: 'get',
            data: params
        })
    },
    updateAdminStatus(id, status) {
        const data = {
            id,
            status
        }
        return request({
            url: "/admin/updateStatus",
            method: 'put',
            data: data
        })
    },
    addAdmin(data) {
        return request({
            url: '/admin/add',
            method: 'post',
            data: data
        })
    },
    adminInfo(id) {
        const data = {
            id
        }
        return request({
            url: '/admin/info',
            method: 'get',
            data: data
        })
    },
    adminUpdate(data) {
        return request({
            url: '/admin/update',
            method: 'put',
            data: data
        })
    },
    resetPassword(id, password) {
        const data = {
            id,
            password
        }
        return request({
            url: '/admin/updatePassword',
            method: 'put',
            data: data
        })
    },
    deleteAdmin(id) {
        const data = {
            id
        }
        return request({
            url: '/admin/delete',
            method: 'delete',
            data: data
        })
    },
    adminUpdatePersonal(data) {
        return request({
            url: '/admin/updatePersonal',
            method: 'put',
            data: data
        })
    },
    adminUpdatePersonalPassword(data) {
        return request({
            url: '/admin/updatePersonalPassword',
            method: 'put',
            data: data
        })
    },
    // sysLoginInfo登录日志
    querySysLoginInfoList(params) {
        return request({
            url: "/sysLoginInfo/list",
            method: 'get',
            data: params
        })
    },
    batchDeleteSysLoginInfo(ids) {
        const data = {
            ids
        }
        return request({
            url: '/sysLoginInfo/batch/delete',
            method: 'delete',
            data: data
        })
    },
    cleanSysLoginInfo() {
        return request({
            url: '/sysLoginInfo/clean',
            method: 'delete'
        })
    },
    deleteSysLoginInfo(id) {
        const data = {
            id
        }
        return request({
            url: '/sysLoginInfo/delete',
            method: 'delete',
            data: data
        })
    },
    // SysOperationLog操作日志
    querySysOperationLogList(params) {
        return request({
            url: "/sysOperationLog/list",
            method: 'get',
            data: params
        })
    },
    batchDeleteSysOperationLog(ids) {
        const data = {
            ids
        }
        return request({
            url: '/sysOperationLog/batch/delete',
            method: 'delete',
            data: data
        })
    },
    cleanSysOperationLog() {
        return request({
            url: '/sysOperationLog/clean',
            method: 'delete'
        })
    },
    deleteSysOperationLog(id) {
        const data = {
            id
        }
        return request({
            url: '/sysOperationLog/delete',
            method: 'delete',
            data: data
        })
    },
}
