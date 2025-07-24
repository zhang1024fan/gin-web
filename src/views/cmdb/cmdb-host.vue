<template>
  <el-card shadow="hover" style="width: 100%">
    <!-- 左右布局容器 -->
    <div class="host-management-container">
      <!-- 左侧分组树 -->
      <div class="group-tree-section">
        <el-card shadow="never" style="height: 100%; border: none;">
          <div slot="header">
            <span>资产分组</span>
          </div>
          <!-- 搜索框 -->
          <el-input
            v-model="groupSearchText"
            placeholder="搜索分组"
            clearable
            size="small"
            style="margin-bottom: 10px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-tree
              :data="groupList"
              :props="defaultProps"
              node-key="id"
              :default-expanded-keys="expandedKeys"
              :highlight-current="true"
              @node-click="handleGroupClick"
              @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse"
              style="border: none; padding: 5px;"
          >
            <template v-slot="{ node, data }">
              <span :class="{ 'font-weight-bold': !data.parentId }">
                <!-- 一级分组：根据展开状态切换图标 -->
                <template v-if="!data.parentId">
                  <el-icon v-if="expandedKeys.includes(node.key)" style="margin-right: 5px"><FolderOpened /></el-icon>
                  <el-icon v-else style="margin-right: 5px"><Folder /></el-icon>
                </template>
                <!-- 二级分组：固定使用DocumentRemove图标 -->
                <template v-else>
                  <el-icon style="margin-right: 5px"><DocumentRemove /></el-icon>
                </template>
                {{ node.label }}
              </span>
            </template>
          </el-tree>
        </el-card>
      </div>
      <!-- 右侧主机管理区域 -->
      <div class="host-table-section">
        <!-- 搜索表单 -->
        <div class="search-form-section">
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="主机名称" prop="hostName">
              <el-input
                  size="mini"
                  placeholder="请输入主机名称"
                  clearable
                  v-model="queryParams.hostName"
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="IP地址" prop="ip">
              <el-input
                  size="mini"
                  placeholder="请输入IP地址"
                  clearable
                  v-model="queryParams.ip"
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select size="mini" placeholder="请选择状态" v-model="queryParams.status" style="width: 100px;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- 操作按钮 -->
            <el-row :gutter="10" class="mb8" style="text-align: left">
              <el-col :span="24">
                <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="primary" icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button plain type="primary" icon="Plus" size="mini" @click="addDialogVisible = true">新增</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 主机表格 -->
        <div class="table-section">
          <el-table
              v-loading="loading"
              :data="hostList"
              border
              stripe
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column label="ID" prop="id" v-if="false" />
            <el-table-column label="主机名称" prop="hostName" width="120" />
            <el-table-column label="IP地址" prop="sshIp" width="120" />
            <el-table-column label="操作系统" prop="os" width="120" />
            <el-table-column label="CPU" prop="cpu" width="80" />
            <el-table-column label="内存" prop="memory" width="80" />
            <el-table-column label="磁盘" prop="disk" width="80" />
            <el-table-column label="状态" width="100">
              <template v-slot="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                  {{ scope.row.status === 1 ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="160" />
            <el-table-column label="操作" fixed="right" width="180">
              <template v-slot="scope">
                <div class="table-operation">
                  <el-button size="small" type="text" icon="Edit" @click="showEditHostDialog(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="text" icon="Delete" @click="handleHostDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryParams.pageNum"
              :page-sizes="[10, 50, 100, 500]"
              :page-size="queryParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 新增主机对话框 -->
    <el-dialog title="新增主机" v-model="addDialogVisible" width="40%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="主机名称" prop="hostName">
              <el-input v-model="addForm.hostName" placeholder="请输入主机名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分组" prop="groupId">
              <el-cascader
                v-model="addForm.groupId"
                :options="groupList"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                placeholder="请选择分组"
                style="width: 100%"
                clearable
                @change="handleGroupChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="SSH连接" prop="sshConnection">
              <div style="display: flex; align-items: center">
                <el-input 
                  v-model="addForm.username" 
                  placeholder="用户名" 
                  style="width: 120px; margin-right: 8px" 
                />
                <span style="margin: 0 4px">@</span>
                <el-input 
                  v-model="addForm.ip" 
                  placeholder="IP地址" 
                  style="width: 150px; margin-right: 8px" 
                />
                <span style="margin: 0 4px">-p</span>
                <el-input 
                  v-model="addForm.port" 
                  placeholder="端口" 
                  style="width: 100px" 
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="认证凭据" prop="authId">
              <el-select v-model="addForm.authId" placeholder="请选择认证凭据" style="width: 100%">
                <el-option
                  v-for="item in authList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addHost">确 定</el-button>
          <el-button @click="addDialogVisible = false">取 消</el-button>
        </span>
      </el-form>
    </el-dialog>

    <!-- 编辑主机对话框 -->
    <el-dialog title="编辑主机" v-model="editDialogVisible" width="40%" @close="editDialogClosed">
      <el-form :model="hostInfo" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="主机名称" prop="hostName">
              <el-input v-model="hostInfo.hostName" placeholder="请输入主机名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分组" prop="groupId">
              <el-cascader
                v-model="hostInfo.groupId"
                :options="groupList"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                placeholder="请选择分组"
                style="width: 100%"
                clearable
                @change="handleGroupChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="SSH连接" prop="sshConnection">
              <div style="display: flex; align-items: center">
                <el-input 
                  v-model="hostInfo.username" 
                  placeholder="用户名" 
                  style="width: 120px; margin-right: 8px" 
                />
                <span style="margin: 0 4px">@</span>
                <el-input 
                  v-model="hostInfo.ip" 
                  placeholder="IP地址" 
                  style="width: 150px; margin-right: 8px" 
                />
                <span style="margin: 0 4px">-p</span>
                <el-input 
                  v-model="hostInfo.port" 
                  placeholder="端口" 
                  style="width: 100px" 
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="认证凭据" prop="authId">
              <el-select v-model="hostInfo.authId" placeholder="请选择认证凭据" style="width: 100%">
                <el-option
                  v-for="item in authList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="hostInfo.remark" type="textarea" placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editHost">确 定</el-button>
          <el-button @click="editDialogVisible = false">取 消</el-button>
        </span>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import configApi from '@/api/config'

export default {
  data() {
    return {
      groupSearchText: '',
      expandedKeys: [], // 用于跟踪展开的节点key
      statusList: [
        { value: 1, label: '在线' },
        { value: 0, label: '离线' }
      ],
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        hostName: '',
        ip: '',
        status: '',
        groupId: ''
      },
      hostList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      groupList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentGroupId: null,
      authList: [],
      addForm: {
        hostName: '',
        ip: '',
        port: 22,
        username: '',
        authId: '',
        groupId: '',
        remark: ''
      },
      addFormRules: {
        hostName: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入连接用户名', trigger: 'blur' }],
        authId: [{ required: true, message: '请选择认证凭据', trigger: 'change' }],
        groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }]
      },
      hostInfo: {},
      editFormRules: {
        hostName: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入连接用户名', trigger: 'blur' }],
        authId: [{ required: true, message: '请选择认证凭据', trigger: 'change' }],
        groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getAllGroups()
    this.getAuthList()
    // 默认加载所有主机
    this.getHostList()
  },
  methods: {
    // 获取所有分组
    async getAllGroups() {
      const { data: res } = await this.$api.getAllCmdbGroups()
      if (res.code === 200) {
        this.groupList = res.data
        // 设置默认分组为业务组
        const businessGroup = this.groupList.find(group => group.name === '业务组')
        if (businessGroup) {
          this.addForm.groupId = businessGroup.id
        }
      }
    },

    // 获取认证凭据列表
    async getAuthList() {
      try {
        console.log('正在获取认证凭据列表...')
        const response = await configApi.getEcsAuthList()
        console.log('完整响应:', response)
        
        if (response && response.data) {
          const res = response.data
          console.log('认证凭据接口响应数据:', res)
          
          if (res.code === 200) {
            this.authList = Array.isArray(res.data) ? res.data : []
            if (this.authList.length === 0) {
              console.warn('认证凭据列表为空')
              this.$message.warning('未获取到认证凭据，请先配置凭据')
            } else {
              console.log('获取到认证凭据:', this.authList)
            }
          } else {
            console.error('获取认证凭据失败:', res.message || '未知错误')
            this.$message.error(`获取认证凭据失败: ${res.message || '未知错误'}`)
          }
        } else {
          console.error('无效的响应格式:', response)
          this.$message.error('获取认证凭据失败: 无效的响应格式')
        }
      } catch (error) {
        console.error('获取认证凭据异常:', error)
        this.$message.error(`获取认证凭据异常: ${error.message}`)
        // 临时添加模拟数据用于测试
        this.authList = [
          { id: 1, name: '默认凭据', username: 'root' },
          { id: 2, name: '测试凭据', username: 'test' }
        ]
        console.warn('使用模拟凭据数据:', this.authList)
      }
    },
    
    // 获取主机列表
    async getHostList() {
      this.loading = true
      try {
        const { data: res } = await this.$api.getCmdbHostList(this.queryParams)
        console.log('API响应数据:', res)
        if (res.code === 200) {
          // 根据API实际返回结构调整赋值
          this.hostList = Array.isArray(res.data) ? res.data : []
          this.total = this.hostList.length
          console.log('设置的主机列表:', this.hostList)
          console.log('主机数量:', this.total)
        } else {
          console.error('获取主机列表失败:', res.message)
          this.$message.error(`获取主机列表失败: ${res.message}`)
        }
      } catch (error) {
        console.error('获取主机列表异常:', error)
        this.$message.error('获取主机列表异常')
      } finally {
        this.loading = false
      }
    },
    
    // 处理分组选择变化
    handleGroupChange(value) {
      if (value && value.length > 0) {
        // 取最后一级作为选中分组ID
        this.addForm.groupId = value[value.length - 1]
        this.hostInfo.groupId = value[value.length - 1]
      } else {
        // 如果没有选择分组，设置默认分组
        const defaultGroup = this.groupList.find(item => item.isDefault)
        if (defaultGroup) {
          this.addForm.groupId = defaultGroup.id
          this.hostInfo.groupId = defaultGroup.id
        }
      }
    },

    // 根据分组获取主机
    async getHostsByGroup(groupId) {
      this.loading = true
      this.queryParams.groupId = groupId
      try {
        const { data: res } = await this.$api.getCmdbHostsByGroupId(groupId)
        if (res.code === 200) {
          this.hostList = res.data || []
          this.total = res.data?.length || 0
        }
      } catch (error) {
        console.error('获取主机列表失败:', error)
        this.hostList = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    
    // 点击分组节点
    handleGroupClick(node, element) {
      let groupId
      if (element && element.data && element.data.id) {
        groupId = element.data.id
      } else if (element && element.id) {
        groupId = element.id
      } else if (node && node.key) {
        groupId = node.key
      }
      
      if (!groupId) {
        this.$message.warning("无法获取分组ID")
        return
      }
      
      this.currentGroupId = groupId
      this.getHostsByGroup(groupId)
    },

    handleNodeExpand(data, node) {
      if (!this.expandedKeys.includes(node.key)) {
        this.expandedKeys.push(node.key)
      }
    },

    handleNodeCollapse(data, node) {
      this.expandedKeys = this.expandedKeys.filter(key => key !== node.key)
    },
    
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getHostList()
    },
    
    // 重置按钮操作
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        hostName: '',
        ip: '',
        status: '',
        groupId: ''
      }
      this.currentGroupId = null
      this.getHostList()
    },
    
    // pageSize变化
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getHostList()
    },
    
    // pageNum变化
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getHostList()
    },
    
    // 监听新增主机对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    
    // 新增主机
    async addHost() {
      try {
        await this.$refs.addFormRef.validate()
        
        // 验证凭据是否存在
        const authExists = this.authList.some(auth => auth.id === this.addForm.authId)
        if (!authExists) {
          return this.$message.error('选择的认证凭据不存在，请刷新凭据列表后重试')
        }

        // 转换数据格式为后端期望的结构
        const requestData = {
          groupId: this.addForm.groupId,
          hostName: this.addForm.hostName,
          remark: this.addForm.remark,
          sshIp: this.addForm.ip,
          sshKeyId: this.addForm.authId,
          sshName: this.addForm.username,
          sshPort: this.addForm.port
        }

        console.log('新增主机请求数据:', JSON.stringify(requestData, null, 2))
        const { data: res } = await this.$api.createCmdbHost(requestData)
        console.log('新增主机响应:', res)
        
        if (res.code === 200) {
          this.$message.success('新增主机成功')
          this.addDialogVisible = false
          this.getHostList()
        } else if (res.code === 426) {
          this.$message.error(`认证凭据不存在(凭据ID: ${this.addForm.authId})，请检查后重试`)
          // 刷新凭据列表
          await this.getAuthList()
        } else {
          this.$message.error(res.message || '新增主机失败')
        }
      } catch (error) {
        console.error('新增主机失败:', error)
        this.$message.error('新增主机失败: ' + error.message)
      }
    },
    
    // 展示编辑主机对话框
    async showEditHostDialog(id) {
      const { data: res } = await this.$api.getCmdbHostById(id)
      if (res.code === 200) {
        this.hostInfo = res.data
        this.editDialogVisible = true
      }
    },
    
    // 监听编辑主机对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    
    // 编辑主机信息
    async editHost() {
      try {
        await this.$refs.editFormRef.validate()
        
        // 验证凭据是否存在
        const authExists = this.authList.some(auth => auth.id === this.hostInfo.authId)
        if (!authExists) {
          return this.$message.error('选择的认证凭据不存在，请刷新凭据列表后重试')
        }

        // 转换数据格式为后端期望的结构
        const requestData = {
          id: this.hostInfo.id,
          groupId: this.hostInfo.groupId,
          hostName: this.hostInfo.hostName,
          remark: this.hostInfo.remark,
          sshIp: this.hostInfo.ip,
          sshKeyId: this.hostInfo.authId,
          sshName: this.hostInfo.username,
          sshPort: this.hostInfo.port
        }

        console.log('编辑主机请求数据:', JSON.stringify(requestData, null, 2))
        const { data: res } = await this.$api.updateCmdbHost(requestData)
        console.log('编辑主机响应:', res)
        
        if (res.code === 200) {
          this.$message.success('修改主机成功')
          this.editDialogVisible = false
          this.getHostList()
        } else if (res.code === 426) {
          this.$message.error(`认证凭据不存在(凭据ID: ${this.hostInfo.authId})，请检查后重试`)
          // 刷新凭据列表
          await this.getAuthList()
        } else {
          this.$message.error(res.message || '修改主机失败')
        }
      } catch (error) {
        console.error('修改主机失败:', error)
        this.$message.error('修改主机失败: ' + error.message)
      }
    },
    
    // 删除主机
    async handleHostDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除主机"' + row.hostName + '"?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      
      const { data: res } = await this.$api.deleteCmdbHost(row.id)
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getHostList()
      }
    }
  }
}
</script>

<style scoped>
.host-management-container {
  display: flex;
  height: calc(100vh - 180px);
}

.group-tree-section {
  width: 250px;
  margin-right: 20px;
}

.host-table-section {
  flex: 1;
  overflow: auto;
}

.search-form-section {
  margin-bottom: 15px;
}

.table-section {
  margin-bottom: 15px;
}

.pagination-section {
  text-align: right;
}

.font-weight-bold {
  font-weight: bold;
}

.table-operation {
  display: flex;
  justify-content: space-around;
}
</style>
