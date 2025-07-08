import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/dashboard/index.vue'
import Personal from '@/views/system/Personal.vue'
import Admin from '@/views/system/Admin.vue'
import Role from '@/views/system/Role.vue'
import Dept from '@/views/system/Dept.vue'
import Post from '@/views/system/Post.vue'
import Menu from '@/views/system/Menu.vue'
import LoginLog from '@/views/monitor/LoginLog.vue'
import Operator from '@/views/monitor/Operator.vue'
import Host from    '@/views/cmdb/cmdb-host.vue'
import k8slist from '@/views/K8s/k8s-cplony.vue'
import k8snodes from '@/views/K8s/k8s-nodes.vue'
import ecskey     from '@/views/configcenter/ecs-key.vue'
import jenkinskey from '@/views/configcenter/jenkins-key.vue'


// 路由集合
const routes = [
    {path: '/',      redirect: '/login'},
    {path: '/login', component: Login},
    {
        path: '/home',
        component: Home,
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard', // 主页现在指向dashboard
                component: Dashboard,
                meta: {tTitle: '仪表盘'}
            },
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
            },
            {
                path: '/cmdb/ecs',
                component: Host,
                meta: {sTitle: '资产管理', tTitle: '主机管理'}
            },
            {
                path: '/k8s/list',
                component: k8slist,
                meta: {sTitle: '容器管理', tTitle: '集群管理'}
            },
            {
                path: '/k8s/node',
                component: k8snodes,
                meta: {sTitle: '容器管理', tTitle: '节点管理'}
            },
            {
                path: '/config/ecskey',
                component: ecskey,
                meta: {sTitle: '配置中心', tTitle: '主机凭据'}
            },
            {
                path: '/config/jenkinskey',
                component: jenkinskey,
                meta: {sTitle: '配置中心', tTitle: 'jenkins凭据'}
            }
        ]
    }
]

// 创建 router 实例 ✅ 唯一的一次
const router = createRouter({
    history: createWebHistory(),
    routes // 使用上面定义的 routes 数组
})

// 引入 storage 工具类
import storage from '@/utils/storage'

// 挂载导航守卫
router.beforeEach((to, from, next) => {
    const token = storage.getItem('token')
    const sysAdmin = storage.getItem('sysAdmin')

    // 如果已经登录，且访问的是登录页，则跳转到首页
    if (to.path === '/login' && token && sysAdmin) {
        return next('/dashboard')
    }

    // 如果访问的是非登录页，检查是否登录
    if (to.path !== '/login') {
        if (!token || !sysAdmin) {
            // 未登录，跳转到登录页
            return next('/login')
        }
    }

    // 其他情况正常放行
    next()
})

export default router
