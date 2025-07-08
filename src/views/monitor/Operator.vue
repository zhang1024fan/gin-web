<template>
  <el-card>
    <!--条件搜索区域-->
    <el-form :model="queryParams" :inline="true" v-show="showSearch">
      <el-form-item prop="username" label="用户名称">
        <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable size="mini"
                  @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item prop="beginTime" label="开始时间">
        <el-date-picker class="input-width" v-model="queryParams.beginTime" size="mini" type="date"
                        style="width: 190px" value-format="yyyy-MM-dd" clearable placeholder="请选择开始时间"
                        @keyup.enter="handleQuery"></el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime" label="结束时间">
        <el-date-picker class="input-width" v-model="queryParams.endTime" size="mini" type="date"
                        style="width: 190px" value-format="yyyy-MM-dd" clearable placeholder="请选择结束时间"
                        @keyup.enter="handleQuery"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" size="mini" :disabled="multiple"
                   @click="batchHandleDelete" v-authority="['monitor:operator:delete']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" size="mini" @click="handleClean"
                   v-authority="['monitor:operator:clean']">清空</el-button>
      </el-col>
    </el-row>
    <!--列表区域-->
    <el-table v-loading="Loading" :data="sysOperationLogList" border stripe style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column label="ID" prop="id" v-if="false" />
      <el-table-column label="用户账号" prop="username" />
      <el-table-column label="请求方式" width="180">
        <template #default="scope">
          <el-tag
              :type="{
        'GET': 'info',
        'POST': 'success',
        'PUT': 'warning',
        'DELETE': 'danger'
      }[scope.row.method.toUpperCase()] || 'info'"
              size="small"
          >
            {{ scope.row.method }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" prop="Ip" />
      <el-table-column label="请求的URL" prop="Url" />
      <el-table-column label="操作时间" prop="createTime" />
      <el-table-column label="更多操作">
        <template v-slot="scope">
          <el-button size="small" type="text" icon="Delete" @click=handleDelete(scope.row.id)
                     v-authority="['monitor:operator:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum" :page-sizes="[10, 50, 100, 500, 1000]" :page-size="queryParams.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      Loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      queryParams: {},
      sysOperationLogList: [],
    }
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 查询列表
    async getSysOperationLogList() {
      this.Loading = true
      const { data: res } = await this.$api.querySysOperationLogList(this.queryParams)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.sysOperationLogList = res.data.list
        this.total = res.data.total
        this.Loading = false
      }
    },
    // 搜索按钮操作
    handleQuery() {
      this.getSysOperationLogList();
    },
    // 重置按钮操作
    resetQuery() {
      this.queryParams = {}
      this.getSysOperationLogList();
      this.$message.success("重置成功")
    },
    // pageSize
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getSysOperationLogList()
    },
    // pageNum
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getSysOperationLogList()
    },
    // 清空
    async handleClean() {
      const confirmResult = await this.$confirm('是否清空操作日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$api.cleanSysOperationLog()
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('清空成功')
        await this.getSysOperationLogList()
      }
    },
    // 删除
    async handleDelete(id) {
      const confirmResult = await this.$confirm('是否确认删除操作日志编号为"' + id + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteSysOperationLog(id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getSysOperationLogList()
      }
    },
    // 批量删除
    async batchHandleDelete() {
      const sysOperationLogIds = this.ids;
      const confirmResult = await this.$confirm('是否确认删除操作日志编号为"' + sysOperationLogIds + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.batchDeleteSysOperationLog(sysOperationLogIds)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getSysOperationLogList()
      }
    },
  },
  created() {
    this.getSysOperationLogList()
  },
}
</script>

<style lang="less" scoped></style>
