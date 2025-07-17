import Personal from '@/views/system/Personal.vue'
import Admin from '@/views/system/Admin.vue'
import Role from '@/views/system/Role.vue'
import Dept from '@/views/system/Dept.vue'
import Post from '@/views/system/Post.vue'
import Menu from '@/views/system/Menu.vue'
import LoginLog from '@/views/monitor/LoginLog.vue'
import Operator from '@/views/monitor/Operator.vue'

const routes = [
    {
        path: '/system/personal',
        component: Personal,
        meta: {sTitle: '个人中心', tTitle: '个人信息'}
    },
    {
        path: '/system/admin',
        component: Admin,
        meta: {sTitle: '基础管理', tTitle: '用户信息'}
    },
    {
        path: '/system/role',
        component: Role,
        meta: {sTitle: '基础管理', tTitle: '角色信息'}
    },
    {
        path: '/system/menu',
        component: Menu,
        meta: {sTitle: '基础管理', tTitle: '菜单信息'}
    },
    {
        path: '/system/dept',
        component: Dept,
        meta: {sTitle: '基础管理', tTitle: '部门信息'}
    },
    {
        path: '/system/post',
        component: Post,
        meta: {sTitle: '基础管理', tTitle: '岗位信息'}
    },
    {
        path: '/monitor/loginlog',
        component: LoginLog,
        meta: {sTitle: '日志管理', tTitle: '登录日志'}
    },
    {
        path: '/monitor/operator',
        component: Operator,
        meta: {sTitle: '日志管理', tTitle: '操作日志'}
    }
]

export default routes
