/**
 * 权限指令 - Vue 3 版本
 *
 * @author xiaoRui
 */
import { checkAuthority } from "@/utils/authority"
import storage from "@/utils/storage"

export default {
    mounted(el, binding) {
        const { value } = binding
        const permissions = storage.getItem('permissionList') || []
        const hasPermission = checkAuthority(value, permissions)

        if (!hasPermission) {
            // 如果没有权限，移除该元素
            if (el.parentNode) {
                el.parentNode.removeChild(el)
            } else {
                el.innerHTML = ''
            }
        } else {
            // 可选：添加 code 属性用于调试或后续校验
            el.setAttribute('code', value)
        }
    }
}
