import k8slist from '@/views/K8s/k8s-cplony.vue'
import k8snodes from '@/views/K8s/k8s-nodes.vue'
import k8sNodelist from '@/views/K8s/k8s-nodelist.vue'
import k8spods from '@/views/K8s/k8s-pod.vue'

const routes = [
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
        path: '/k8s/nodelist/:nodeId',
        component: k8sNodelist,
        meta: {sTitle: '容器管理', tTitle: '节点详情'}
    },
    {
        path: '/k8s/pod',
        component: k8spods,
        meta: {sTitle: '容器管理', tTitle: 'Pod管理'}
    }
]

export default routes
