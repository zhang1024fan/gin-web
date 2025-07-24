import ecskey from '@/views/configcenter/ecs-key.vue'
import jenkinskey from '@/views/configcenter/jenkins-key.vue'

const routes = [
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

export default routes
