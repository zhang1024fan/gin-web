<template>
  <el-drawer
    v-model="drawerVisible"
    title="主机详情"
    direction="rtl"
    size="40%"
    :before-close="handleClose"
  >
    <!-- 基本信息部分 -->
    <h3 style="margin: 20px 0 10px 0">基本信息</h3>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="主机名称">{{ detail.hostName }}</el-descriptions-item>
      <el-descriptions-item label="主机分组">{{ getGroupName(detail.groupId) }}</el-descriptions-item>
      <el-descriptions-item label="连接地址">
        {{ detail.sshName }}@{{ detail.sshIp }}:{{ detail.sshPort }}
      </el-descriptions-item>
      <el-descriptions-item label="认证类型">
        {{ detail.sshKeyId ? '密钥' : '密码' }}
      </el-descriptions-item>
      <el-descriptions-item label="描述信息">{{ detail.remark }}</el-descriptions-item>
    </el-descriptions>

    <!-- 扩展信息部分 -->
    <h3 style="margin: 20px 0 10px 0">扩展信息</h3>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="实例ID">{{ detail.instanceId }}</el-descriptions-item>
      <el-descriptions-item label="实例名称">{{ detail.name }}</el-descriptions-item>
      <el-descriptions-item label="操作系统">{{ detail.os }}</el-descriptions-item>
      <el-descriptions-item label="CPU">{{ detail.cpu }}核</el-descriptions-item>
      <el-descriptions-item label="内存">{{ detail.memory }}G</el-descriptions-item>
      <el-descriptions-item label="磁盘">{{ detail.disk }}GB</el-descriptions-item>
      <el-descriptions-item label="内网IP">{{ detail.privateIp }}</el-descriptions-item>
      <el-descriptions-item label="公网IP">{{ detail.publicIp || '无' }}</el-descriptions-item>
      <el-descriptions-item label="实例计费方式">{{ detail.billingType }}</el-descriptions-item>
      <el-descriptions-item label="网络计费方式">{{ detail.networkBillingType || '按流量计费' }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      <el-descriptions-item label="到期时间">{{ detail.expireTime || '无' }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ detail.updateTime }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => ({})
    },
    groupList: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerVisible: this.visible
    }
  },
  watch: {
    visible(newVal) {
      this.drawerVisible = newVal
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    getGroupName(groupId) {
      if (!groupId) return '未分组'
      const findGroup = (groups, id) => {
        for (const group of groups) {
          if (group.id === id) return group.name
          if (group.children && group.children.length > 0) {
            const found = findGroup(group.children, id)
            if (found) return found
          }
        }
        return null
      }
      return findGroup(this.groupList, groupId) || '未知分组'
    }
  }
}
</script>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>
