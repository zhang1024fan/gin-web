<template>
  <div>
    <h2>节点详情 - {{ nodeId }}</h2>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="节点名称">{{ nodeId }}</el-descriptions-item>
      <el-descriptions-item label="状态">运行中</el-descriptions-item>
      <el-descriptions-item label="CPU使用率">30%</el-descriptions-item>
      <el-descriptions-item label="内存使用率">45%</el-descriptions-item>
      <el-descriptions-item label="创建时间">2023-01-01</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const nodeId = route.params.nodeId
</script>

<style scoped>
</style>
