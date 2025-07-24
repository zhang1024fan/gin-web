<template>
  <el-card shadow="never" style="height: 100%; border: none;">
    <div slot="header">
      <h3>资产分组</h3>
    </div>
    <el-input
      v-model="groupSearchText"
      placeholder="搜索分组"
      clearable
      size="medium"
      style="margin-bottom: 20px; width: 100%"
      @input="handleGroupSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <el-tree
      ref="groupTree"
      :data="groupList"
      :props="defaultProps"
      node-key="id"
      :expanded-keys="expandedKeys"
      :highlight-current="true"
      @node-click="handleGroupClick"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
      style="border: none; padding: 5px;"
    >
      <template v-slot="{ node, data }">
        <span :class="{ 'font-weight-bold': !data.parentId }">
          <template v-if="!data.parentId">
            <el-icon v-if="expandedKeys.includes(node.key)" style="margin-right: 5px"><FolderOpened /></el-icon>
            <el-icon v-else style="margin-right: 5px"><Folder /></el-icon>
          </template>
          <template v-else>
            <el-icon style="margin-right: 5px"><Tickets /></el-icon>
          </template>
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </el-card>
</template>

<script>
export default {
  props: {
    groupList: {
      type: Array,
      required: true
    },
    expandedKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      groupSearchText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    handleGroupSearch() {
      this.$emit('group-search', this.groupSearchText)
    },
    handleGroupClick(node, element) {
      this.$emit('group-click', node, element)
    },
    handleNodeExpand(data, node) {
      this.$emit('node-expand', data, node)
    },
    handleNodeCollapse(data, node) {
      this.$emit('node-collapse', data, node)
    }
  }
}
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}
</style>
