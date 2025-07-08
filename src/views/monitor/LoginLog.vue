<template>
  <el-card>
    <!--条件搜索区域-->
    <el-form :model="queryParams" :inline="true">
      <el-form-item prop="username" label="用户名称">
        <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable size="mini"
                  @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item prop="loginStatus" label="登录状态">
        <el-select size="mini" placeholder="岗位状态" v-model="queryParams.loginStatus" style="width: 100px;">
          <el-option v-for="item in loginStatusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
                   @click="batchHandleDelete" v-authority="['monitor:loginLog:delete']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" size="mini" @click="handleClean" v-authority="['monitor:loginLog:clean']">清空</el-button>
      </el-col>
    </el-row>
    <!--列表区域-->
    <el-table v-loading="Loading" :data="sysLoginInfoList" border stripe style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column label="ID" prop="id" v-if="false" />
      <el-table-column label="用户账号" prop="username" />
      <el-table-column label="登录IP地址" prop="ipAddress" />
      <el-table-column label="登录地点" prop="loginLocation" />
      <el-table-column label="浏览器类型" prop="browser" />
      <el-table-column label="操作系统" prop="os" />
      <el-table-column label="登录状态" prop="loginStatus">
        <template v-slot="scope">
          <el-tag v-if="scope.row.loginStatus === 1" type="success">成功</el-tag>
          <el-tag v-else-if="scope.row.loginStatus === 2" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提示消息" prop="message" />
      <el-table-column label="访问时间" prop="loginTime" />
      <el-table-column label="更多操作">
        <template v-slot="scope">
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id)" v-authority="['monitor:loginLog:delete']">删除
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
      queryParams: {},
      loginStatusList: [{
        value: '1',
        label: '成功'
      }, {
        value: '2',
        label: '失败'
      }],
      sysLoginInfoList: [],
      Loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
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
    async getSysLoginInfoList() {
      this.Loading = true
      const { data: res } = await this.$api.querySysLoginInfoList(this.queryParams)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.sysLoginInfoList = res.data.list
        this.total = res.data.total
        this.Loading = false
      }
    },
    // 搜索按钮操作
    handleQuery() {
      this.getSysLoginInfoList();
    },
    // 重置按钮操作
    resetQuery() {
      this.queryParams = {}
      this.getSysLoginInfoList();
      this.$message.success("重置成功")
    },
    // pageSize
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getSysLoginInfoList()
    },
    // pageNum
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getSysLoginInfoList()
    },
    // 清空
    async handleClean() {
      const confirmResult = await this.$confirm('是否清空登录日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$api.cleanSysLoginInfo()
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('清空成功')
        await this.getSysLoginInfoList()
      }
    },
    // 删除
    async handleDelete(id) {
      const confirmResult = await this.$confirm('是否确认删除登录日志编号为"' + id + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteSysLoginInfo(id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getSysLoginInfoList()
      }
    },
    // 批量删除
    async batchHandleDelete() {
      const loginInfoIds = this.ids;
      const confirmResult = await this.$confirm('是否确认删除登录日志编号为"' + loginInfoIds + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.batchDeleteSysLoginInfo(loginInfoIds)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getSysLoginInfoList()
      }
    },
  },
  created() {
    this.getSysLoginInfoList()
  }
}
</script>

<style lang="less" scoped></style>
