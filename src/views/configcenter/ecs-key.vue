<template>
  <el-card>
    <!--搜索-->
    <el-form :inline="true" :model="queryParams" ref="queryForm">
      <el-form-item label="凭据名称" prop="name">
        <el-input placeholder="请输入凭据名称" clearable size="mini" v-model="queryParams.name"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!--操作按钮-->
    <div class="mb8" style="text-align: left">
      <el-button plain type="primary" icon="Plus" size="mini"
                 @click="showAddDialog">创建凭据</el-button>
    </div>
    
    <!--列表-->
    <el-table border stripe :header-cell-style="{ background: '#eef1f6', color: '#606266' }" 
              v-loading="loading" :data="authList">
      <el-table-column label="凭据名称" prop="name" />
      <el-table-column label="用户名" prop="username" v-if="authList.some(item => item.type === 1)" />
      <el-table-column label="端口" prop="port" width="100" />
      <el-table-column label="认证信息" width="120">
        <template v-slot="scope">
          <el-tag :type="scope.row.type === 1 ? 'success' : 'warning'">
            {{ scope.row.type === 1 ? '密码认证' : (scope.row.type === 2 ? '密钥认证' : '未知类型') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" class-name="small-padding fixed-width" width="180">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="Edit" @click="showEditDialog(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!--新增/编辑对话框-->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="凭据名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口" prop="port">
              <el-input v-model.number="formData.port" type="number" :min="1" :max="65535"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="认证类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">密码认证</el-radio>
            <el-radio :label="2">密钥认证</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="formData.type === 1" label="密码" prop="password">
          <el-input v-model="formData.password" show-password></el-input>
        </el-form-item>
        
        <el-form-item v-if="formData.type === 2" label="公钥" prop="publicKey">
          <el-input 
            v-model="formData.publicKey" 
            type="textarea" 
            :rows="4"
            placeholder="请输入SSH公钥内容"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import API from '@/api/config'

export default {
  data() {
    return {
      queryParams: {},
      loading: false,
      authList: [],
      dialogVisible: false,
      dialogTitle: '',
      formData: {
        id: '',
        name: '',
        type: undefined, // 初始不设置默认值
        username: '',
        password: '',
        publicKey: '',
        port: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入凭据名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择认证类型', trigger: 'change' }],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { 
            required: true, 
            message: '请输入密码', 
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.formData.type === 1 && !value) {
                callback(new Error('请输入密码'))
              } else {
                callback()
              }
            }
          }
        ],
        publicKey: [
          { 
            required: true, 
            message: '请输入公钥', 
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.formData.type === 2 && !value) {
                callback(new Error('请输入公钥'))
              } else {
                callback()
              }
            }
          }
        ],
        port: [
          { 
            required: true, 
            message: '请输入端口号', 
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入端口号'))
              } else if (isNaN(value) || value < 1 || value > 65535) {
                callback(new Error('请输入1-65535之间的有效端口号'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 获取凭据列表
    async getList() {
      this.loading = true
      try {
        const { data: res } = await API.getEcsAuthList()
        if (res.code === 200) {
          this.authList = res.data || []
        } else {
          this.$message.error(res.message || '获取凭据列表失败')
        }
      } catch (error) {
        console.error('获取凭据列表失败:', error)
        this.$message.error('获取凭据列表失败')
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    async handleQuery() {
      if (!this.queryParams.name) {
        this.getList()
        return
      }
      
      this.loading = true
      try {
        const { data: res } = await API.getEcsAuthByName(this.queryParams.name)
        if (res.code === 200) {
          this.authList = res.data ? [res.data] : []
        } else {
          this.$message.error(res.message || '查询失败')
        }
      } catch (error) {
        console.error('查询失败:', error)
        this.$message.error('查询失败')
      } finally {
        this.loading = false
      }
    },
    
    // 重置搜索
    resetQuery() {
      this.queryParams = {}
      this.getList()
    },
    
    // 显示新增对话框
    showAddDialog() {
      this.dialogTitle = '创建凭据'
      this.$nextTick(() => {
        this.formData = {
          id: '',
          name: '',
          type: undefined,
          username: '',
          password: '',
          publicKey: '',
          port: '',
          remark: ''
        }
        this.dialogVisible = true
        console.log('Add dialog opened, formData:', this.formData)
      })
    },
    
    // 显示编辑对话框
    showEditDialog(row) {
      this.dialogTitle = '修改凭据'
      this.$nextTick(() => {
        this.formData = {
          id: row.id,
          name: row.name,
          type: Number(row.type),
          username: row.username,
          password: row.type === 1 ? row.password : '',
          publicKey: row.type === 2 ? row.publicKey : '',
          port: row.port || '',
          remark: row.remark || ''
        }
        this.dialogVisible = true
        console.log('Edit dialog opened for row:', row, 'formData:', this.formData)
      })
    },
    
    // 提交表单
    async submitForm() {
      try {
        await this.$refs.formRef.validate()
        
        // 确保type是数字类型且有效
        const typeValue = Number(this.formData.type)
        if (typeValue !== 1 && typeValue !== 2) {
          throw new Error('请选择有效的认证类型')
        }

        const formData = {
          ...this.formData,
          type: typeValue
        }
        console.log('Submitting form with data:', formData)

        let res
        if (formData.id) {
          // 更新
          res = await API.updateEcsAuth(formData)
        } else {
          // 新增
          res = await API.createEcsAuth(formData)
        }

        if (res.data.code === 200) {
          this.$message.success(formData.id ? '修改成功' : '创建成功')
          this.dialogVisible = false
          // 强制刷新列表数据
          await this.getList()
          console.log('List after update:', this.authList)
        } else {
          this.$message.error(res.data.message || (formData.id ? '修改失败' : '创建失败'))
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败: ' + error.message)
      }
    },
    
    // 删除凭据
    async handleDelete(row) {
      try {
        await this.$confirm(`确定删除凭据"${row.name}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const { data: res } = await API.deleteEcsAuth(row.id)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
