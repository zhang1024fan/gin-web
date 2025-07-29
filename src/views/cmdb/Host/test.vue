<template>
  <el-card shadow="hover" style="width: 100%">
    <!-- 左右布局容器 -->
    <div class="host-management-container">
      <!-- 左侧分组树 -->
      <div class="group-tree-section">
        <el-card shadow="never" style="height: 100%; border: none;">
          <div slot="header">
            <h3>资产分组</h3>
          </div>
          <!-- 搜索框 -->
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
                <!-- 一级分组：根据展开状态切换图标 -->
                <template v-if="!data.parentId">
                  <el-icon v-if="expandedKeys.includes(node.key)" style="margin-right: 5px"><FolderOpened /></el-icon>
                  <el-icon v-else style="margin-right: 5px"><Folder /></el-icon>
                </template>
                <!-- 二级分组：固定使用DocumentRemove图标 -->
                <template v-else>
                  <el-icon style="margin-right: 5px"><Tickets /></el-icon>
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
            <el-form-item label="主机状态" prop="status">
              <el-select size="mini"  placeholder="请选择状态" v-model="queryParams.status" style="width: 150px;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- 操作按钮 -->
            <el-row :gutter="10" class="mb8" style="text-align: left">
              <el-col :span="24">
                <el-button type="primary" icon="Search" size="mini" @click="handleQuery" style="margin-right: 20px">搜索</el-button>
                <el-button type="primary" icon="Refresh" size="mini" @click="resetQuery" style="margin-right: 20px">重置</el-button>
                <!--新建主机-->
                <el-dropdown>
                  <el-button type="primary" size="mini">
                    <el-icon><plus /></el-icon>&nbsp;新建<el-icon
                      class="el-icon--right"
                      ><arrow-down
                    /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="addDialogVisible = true"><el-icon color="#409EFC" :size="20"><Edit /></el-icon>导入主机</el-dropdown-item>
                      <el-dropdown-item @click="cloudDialogVisible = true"
                        ><el-icon color="#409EFC" :size="20"><Folder /></el-icon
                        >Excel</el-dropdown-item
                      >
                      <el-dropdown-item @click="cloudDialogVisible = true"
                        ><el-icon color="#409EFC" :size="21"><MostlyCloudy /></el-icon>云主机</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
            <el-table-column label="主机名称" width="120">
              <template v-slot="scope">
                <el-link type="primary" @click="showHostDetail(scope.row)">{{ scope.row.hostName }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="IP地址" width="150">
              <template v-slot="scope">
                <div>
                  <div v-if="scope.row.publicIp" style="color: #409EFF; margin-top: 4px">
                    <el-icon><Cloudy /></el-icon> {{ scope.row.publicIp || '无公网IP' }}
                  </div>
                  <div v-if="scope.row.privateIp" style="color: #67C23A">
                    <el-icon><HomeFilled /></el-icon> {{ scope.row.privateIp || '无内网IP' }}
                  </div>

                </div>
              </template>
            </el-table-column>
            <el-table-column label="主机类型" prop="vendor" width="120">
              <template v-slot="scope">
                <div style="display: flex; align-items: center">
                  <template v-if="scope.row.vendor == 1">
                    <el-icon :size="18" color="#409EFF"><OfficeBuilding /></el-icon>
                    <span style="margin-left: 5px">自建主机</span>
                  </template>
                  <template v-else-if="scope.row.vendor == 2">
                    <img src="@/assets/image/aliyun.png" style="width: 18px; height: 18px"/>
                    <span style="margin-left: 5px">阿里云</span>
                  </template>
                  <template v-else-if="scope.row.vendor == 3">
                    <img src="@/assets/image/tengxun.png" style="width: 18px; height: 18px"/>
                    <span style="margin-left: 5px">腾讯云</span>
                  </template>
                  <template v-else>
                    {{ scope.row.vendor }}
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="配置信息" width="120">
              <template v-slot="scope">
                {{ scope.row.cpu }}核{{ scope.row.memory }}G
              </template>
            </el-table-column>
            <el-table-column label="备注信息" prop="remark"  />
            <el-table-column label="状态" width="100">
              <template v-slot="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template v-slot="scope">
                <div class="table-operation">
                  <el-button size="small" type="text" icon="Edit" @click="showEditHostDialog(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="text" icon="Delete" @click="handleHostDelete(scope.row)">删除</el-button>
                  <el-button size="small" type="text" icon="Connection" @click="handleHostSSH(scope.row.id)">终端</el-button>
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
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'children',
                  disabled: (node) => node.children && node.children.length > 0
                }"
                placeholder="请选择分组"
                style="width: 100%"
                clearable
                filterable
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
              <el-select 
                v-model="addForm.authId" 
                placeholder="请选择认证凭据" 
                style="width: 100%"
                filterable
              >
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

    <!-- 导入云主机对话框 -->
    <CreateCloud v-model="cloudDialogVisible" @success="handleCloudImportSuccess" />

    <!-- SSH终端对话框 -->
    <HostSSH 
      :visible="sshDialogVisible"
      :host-id="currentHostId"
      ref="sshDialog"
      @update:visible="val => sshDialogVisible = val"
      @update:host-id="val => currentHostId = val"
      @hook:mounted="() => console.log('子组件已挂载')"
      @hook:updated="() => console.log('子组件已更新')"
    />
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>
    
    <!-- 调试信息 -->
    <div style="display: none">
      <div>当前sshDialogVisible: {{ sshDialogVisible }}</div>
      <div>当前currentHostId: {{ currentHostId }}</div>
    </div>

    <!-- 主机详情抽屉 -->
    <el-drawer
      v-model="detailDrawer"
      title="主机详情"
      direction="rtl"
      size="40%"
      :before-close="handleDetailClose">
      
      <!-- 基本信息部分 -->
      <h3 style="margin: 20px 0 10px 0">基本信息</h3>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="主机名称">{{ hostDetail.hostName }}</el-descriptions-item>
        <el-descriptions-item label="主机分组">{{ getGroupName(hostDetail.groupId) }}</el-descriptions-item>
        <el-descriptions-item label="连接地址">
          {{ hostDetail.sshName }}@{{ hostDetail.sshIp }}:{{ hostDetail.sshPort }}
        </el-descriptions-item>
        <el-descriptions-item label="认证类型">
          {{ hostDetail.sshKeyId ? '密钥' : '密码' }}
        </el-descriptions-item>
        <el-descriptions-item label="描述信息">{{ hostDetail.remark }}</el-descriptions-item>
      </el-descriptions>

      <!-- 扩展信息部分 -->
      <h3 style="margin: 20px 0 10px 0">扩展信息</h3>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="实例ID">{{ hostDetail.instanceId }}</el-descriptions-item>
        <el-descriptions-item label="实例名称">{{ hostDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ hostDetail.os }}</el-descriptions-item>
        <el-descriptions-item label="CPU">{{ hostDetail.cpu }}核</el-descriptions-item>
        <el-descriptions-item label="内存">{{ hostDetail.memory }}G</el-descriptions-item>
        <el-descriptions-item label="磁盘">{{ hostDetail.disk }}GB</el-descriptions-item>
        <el-descriptions-item label="内网IP">{{ hostDetail.privateIp }}</el-descriptions-item>
        <el-descriptions-item label="公网IP">{{ hostDetail.publicIp || '无' }}</el-descriptions-item>
        <el-descriptions-item label="实例计费方式">{{ hostDetail.billingType }}</el-descriptions-item>
        <el-descriptions-item label="网络计费方式">{{ hostDetail.networkBillingType || '按流量计费' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ hostDetail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="到期时间">{{ hostDetail.expireTime || '无' }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ hostDetail.updateTime }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </el-card>
</template>

<script>
import configApi from '@/api/config'
import CreateCloud from './Host/CreateCloud.vue'
import HostSSH from './Host/Hostssh.vue'

export default {
  components: {
    CreateCloud,
    HostSSH
  },
  data() {
    return {
      groupSearchText: '',
      expandedKeys: [], // 用于跟踪展开的节点key
      statusList: [
        { value: 2, label: '未认证' },
        { value: 1, label: '认证成功' },
        { value: 3, label: '认证失败' }
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
      cloudDialogVisible: false,
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
      },
    // SSH终端对话框相关
    sshDialogVisible: false,
    currentHostId: null,
    
    // 主机详情相关
    detailDrawer: false,
    hostDetail: {
        hostName: '',
        groupId: '',
        privateIp: '',
        publicIp: '',
        sshIp: '',
        sshName: '',
        sshKeyId: '',
        sshPort: 22,
        remark: '',
        vendor: '',
        region: '',
        instanceId: '',
        os: '',
        status: 0,
        cpu: '',
        memory: '',
        disk: '',
        billingType: '',
        createTime: '',
        expireTime: '',
        updateTime: '',
        name: ''
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

    // 处理分组搜索
    async handleGroupSearch() {
      console.log('开始搜索分组:', this.groupSearchText)
      if (!this.groupSearchText) {
        console.log('搜索文本为空，重置展开状态')
        this.expandedKeys = []
        return
      }
      
      try {
        console.log('调用API搜索分组:', this.groupSearchText)
        const { data: res } = await this.$api.getCmdbGroupByName(this.groupSearchText)
        console.log('分组搜索结果:', JSON.stringify(res, null, 2))
        
        if (res.code === 200 && res.data) {
          console.log('找到匹配分组:', res.data)
          
          // 确保树组件引用存在
          const tree = this.$refs.groupTree
          if (!tree) {
            console.error('树组件引用不存在')
            return
          }

          // 打印当前分组树结构
          console.log('当前分组树结构:', JSON.stringify(this.groupList, null, 2))

          // 找到匹配的分组并展开其父级
          const findAndExpandParent = (groups, targetId, path = []) => {
            for (const group of groups) {
              console.log('检查分组:', group.id, '名称:', group.name)
              if (group.id === targetId) {
                console.log('找到目标分组:', group.id)
                return [...path, group.id]
              }
              if (group.children && group.children.length > 0) {
                console.log('检查子分组:', group.children.length)
                const foundPath = findAndExpandParent(group.children, targetId, [...path, group.id])
                if (foundPath) {
                  return foundPath
                }
              }
            }
            return null
          }
          
          // 获取展开路径
          const expandPath = findAndExpandParent(this.groupList, res.data.id)
          console.log('展开路径:', expandPath)
          
          if (expandPath) {
            // 设置展开的keys
            this.expandedKeys = expandPath.slice(0, -1)
            console.log('设置展开的keys:', this.expandedKeys)
            
            // 强制更新树组件
            this.$nextTick(() => {
              console.log('强制更新树组件')
              tree.setCurrentKey(res.data.id)
              console.log('已设置当前选中分组:', res.data.id)
              
              // 确保树组件已更新
              setTimeout(() => {
                console.log('检查树组件状态')
                console.log('当前展开keys:', tree.getCurrentKey())
                console.log('当前选中节点:', tree.getCurrentNode())
              }, 500)
            })
          } else {
            console.warn('未找到匹配分组的路径')
            this.$message.warning('未找到匹配的分组路径')
          }
        } else {
          console.warn('未找到匹配分组')
        }
      } catch (error) {
        console.error('搜索分组失败:', error)
        this.$message.error('搜索分组失败: ' + error.message)
      }
    },

    // 获取认证凭据列表
    async getAuthList() {
      try {
        const response = await configApi.getEcsAuthList()
        
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
        let response
        const { hostName, ip, status, pageNum, pageSize } = this.queryParams
        
        // 构建分页参数
        const baseParams = {
          page: pageNum,
          pageSize: pageSize
        }

        console.log('基础分页参数:', JSON.stringify(baseParams, null, 2))
        
        // 根据查询条件选择API调用
        if (hostName && !ip && !status) {
          console.log('执行主机名称模糊查询，参数:', hostName)
          response = await this.$api.GetCmdbHostsByHostNameLike(hostName, baseParams)
          console.log('模糊查询结果:', response)
        } else if (ip && !hostName && !status) {
          console.log('执行IP精确查询，参数:', ip)
          response = await this.$api.GetCmdbHostsByIP(ip, baseParams)
          console.log('IP查询结果:', response)
        } else if (status && !hostName && !ip) {
          console.log('执行状态查询，参数:', status)
          response = await this.$api.GetCmdbHostsByStatus(status, baseParams)
          console.log('状态查询结果:', response)
        } else {
          // 默认查询所有主机，保留分页参数
          console.log('执行默认查询')
          response = await this.$api.getCmdbHostList(baseParams)
          console.log('默认查询结果:', response)
        }
        
        console.log('查询结果:', JSON.stringify(response, null, 2))

        console.log('API完整响应:', response)
        
        // 处理axios响应结构
        const axiosResponse = response?.data ? response : { data: response }
        
        // 严格检查响应格式
        if (!axiosResponse || typeof axiosResponse !== 'object') {
          throw new Error('API返回无效响应格式')
        }

        // 检查响应数据
        const res = axiosResponse.data
        if (!res || typeof res !== 'object') {
          throw new Error('无效的响应数据结构')
        }

        // 检查响应码
        if (res.code === undefined || res.code !== 200) {
          throw new Error(res.message || '获取主机列表失败')
        }

        // 确保data存在，即使为空数组
        if (res.data === undefined) {
          throw new Error('响应缺少data字段')
        }

        // 处理响应数据 - 适配不同API返回格式
        if (Array.isArray(res.data)) {
          // 直接返回数组的情况（如GetCmdbHostsByIP）
          this.hostList = res.data
          this.total = res.data.length
        } else if (res.data?.list) {
          // 返回分页格式的情况（如getCmdbHostList）
          this.hostList = res.data.list
          this.total = res.data.total
          if (res.data.page) {
            this.queryParams.pageNum = res.data.page
          }
          if (res.data.pageSize) {
            this.queryParams.pageSize = res.data.pageSize
          }
        } else {
          // 其他情况
          this.hostList = []
          this.total = 0
        }
        
        console.log('处理后主机列表:', this.hostList)
        console.log('处理后总数:', this.total)
        
        console.log('成功获取主机列表，数量:', this.hostList.length, '总数:', this.total)
      } catch (error) {
        console.error('获取主机列表异常:', {
          error: error.message,
          stack: error.stack,
          queryParams: this.queryParams
        })
        this.$message.error(`获取主机列表失败: ${error.message}`)
        this.hostList = []
        this.total = 0
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
        const { data: res } = await this.$api.getCmdbHostsByGroupId(groupId, {
          page: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        })
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
        this.hostInfo = {
          id: res.data.id,
          hostName: res.data.hostName,
          groupId: res.data.groupId,
          remark: res.data.remark,
          ip: res.data.sshIp,
          port: res.data.sshPort,
          username: res.data.sshName,
          authId: res.data.sshKeyId
        }
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
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        1: '认证成功',
        2: '未认证', 
        3: '认证失败'
      }
      return statusMap[status] || '未知状态'
    },

    // 获取状态标签类型
    getStatusTagType(status) {
      const typeMap = {
        1: 'success',
        2: 'warning', 
        3: 'danger'
      }
      return typeMap[status] || 'info'
    },

    // 根据分组ID获取分组名称
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
    },

    // 显示主机详情
    async showHostDetail(row) {
      try {
        console.log('开始获取主机详情，ID:', row.id)
        const { data: res } = await this.$api.getCmdbHostById(row.id)
        console.log('获取主机详情响应:', res)
        
        if (res.code === 200) {
          console.log('成功获取主机详情数据:', res.data)
          this.hostDetail = res.data
          this.detailDrawer = true
          console.log('已设置detailDrawer为true')
        } else {
          console.error('获取主机详情失败:', res.message)
          this.$message.error(res.message || '获取主机详情失败')
        }
      } catch (error) {
        console.error('获取主机详情失败:', error)
        this.$message.error('获取主机详情失败: ' + error.message)
      }
    },

    // 关闭详情抽屉
    handleDetailClose() {
      this.detailDrawer = false
    },

    // 处理云主机导入成功
    handleCloudImportSuccess() {
      this.cloudDialogVisible = false
      this.getHostList()
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
    },

    // 连接SSH终端
    handleHostSSH(hostId) {
      console.log('点击终端按钮，hostId:', hostId)
      this.currentHostId = hostId
      console.log('设置currentHostId:', this.currentHostId)
      this.sshDialogVisible = true
      console.log('设置sshDialogVisible:', this.sshDialogVisible)
      
      // 检查子组件引用和props传递
      this.$nextTick(() => {
        console.log('检查子组件引用:', this.$refs.sshDialog)
        if (this.$refs.sshDialog) {
          console.log('子组件props:', {
            hostId: this.$refs.sshDialog.hostId,
            visible: this.$refs.sshDialog.visible
          })
          console.log('子组件data:', {
            loading: this.$refs.sshDialog.loading,
            error: this.$refs.sshDialog.error
          })
        } else {
          console.error('子组件引用不存在')
        }
      })
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

/* 完全移除表单分割线 */
.el-dialog .el-form-item {
  border-bottom: none !important;
  margin-bottom: 12px;
  padding-bottom: 0;
}

/* 移除行和列之间的分割线 */
.el-row {
  border-bottom: none !important;
}

.el-col {
  border-right: none !important;
  padding-right: 0 !important;
  margin-right: 0 !important;
}

/* 移除最后一个列的右边距 */
.el-col:last-child {
  padding-right: 0 !important;
  margin-right: 0 !important;
}
</style>
