import Host from '@/views/cmdb/cmdbHost.vue'
import Group from '@/views/cmdb/cmdbGroup.vue'
import Db from '@/views/cmdb/cmdbDB.vue'

const routes = [
    {
        path: '/cmdb/ecs',
        component: Host,
        meta: {sTitle: '资产管理', tTitle: '主机管理'}
    },
    {
        path: '/cmdb/group',
        component: Group,
        meta: {sTitle: '资产管理', tTitle: '业务分组'}
    },
    {
        path: '/cmdb/db',
        component: Db,
        meta: {sTitle: '资产管理', tTitle: '数据库管理'}
    }
]

export default routes
