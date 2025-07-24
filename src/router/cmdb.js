import Host from '@/views/cmdb/cmdb-host.vue'
import Group from '@/views/cmdb/cmdb-group.vue'
import Db from '@/views/cmdb/cmdb-db.vue'

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
