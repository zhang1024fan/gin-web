<template>
  <el-card>
    <!--搜索-->
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" size="mini" clearable v-model="queryParams.roleName"
                  @keyup.enter="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-select size="mini" placeholder="账号状态" v-model="queryParams.status" style="width: 100px;">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker class="input-width" size="mini" type="date" style="width:190px" value-format="yyyy-MM-dd"
                        clearable placeholder="请选择开始时间" v-model="queryParams.beginTime" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker class="input-width" size="mini" type="date" style="width:190px" value-format="yyyy-MM-dd"
                        clearable placeholder="请选择结束时间" v-model="queryParams.endTime" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain type="primary" icon="Plus" size="mini"
                   @click="addRoleDialogVisible = true" v-authority="['base:role:add']">新增</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table v-loading="Loading" :data="roleList" border stripe style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="ID" prop="id" v-if="false" />
      <el-table-column label="角色名称" prop="roleName" width="150" />
      <el-table-column label="角色标识" prop="roleKey" width="150"  />
      <el-table-column label="创建时间" prop="createTime" width="200" />
      <el-table-column label="账号状态" width="180">
        <template v-slot="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" active-color="#13ce66"
                     inactive-color="#F5222D" active-text="启用" inactive-text="停用" @change="roleUpdateStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" />
      <el-table-column label="更多操作">

        <template v-slot="scope">
          <div style="white-space: nowrap">
            <el-button size="small" type="text" icon="Edit" @click="showEditRoleDialog(scope.row.id)" v-authority="['base:role:edit']">编辑
            </el-button>
            <el-button size="small" type="text" icon="Delete" @click="handleRoleDelete(scope.row)" v-authority="['base:role:delete']">删除
            </el-button>
            <el-button size="small" type="text" icon="Setting" @click="showSetMenuDialog(scope.row)" v-authority="['base:role:assign']">分配权限
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum" :page-sizes="[10, 50, 100, 500, 1000]" :page-size="queryParams.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!--新增角色-->
    <el-dialog title="新增角色" v-model="addRoleDialogVisible" width="30%" @close="addRoleDialogClosed">
      <el-form ref="addRoleFormRefForm" label-width="80px" :model="addRoleForm" :rules="addRoleFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addRoleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input placeholder="请输入角色标识" v-model="addRoleForm.roleKey" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="addRoleForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input placeholder="请输入角色描述" type="textarea" v-model="addRoleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRole">确 定</el-button>
                <el-button type="primary" @click="addRoleDialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    <!--编辑角色-->
    <el-dialog title="编辑角色" v-model="editRoleDialogVisible" width="30%" @close="editRoleDialogClosed">
      <el-form ref="editRoleFormRefForm" label-width="80px" :model="roleInfo" :rules="editRoleFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="roleInfo.roleName" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input placeholder="请输入角色标识" v-model="roleInfo.roleKey" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="roleInfo.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述" prop="status">
          <el-input placeholder="请输入角色描述" type="textarea" v-model="roleInfo.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editRole">确 定</el-button>
                <el-button type="primary" @click="editRoleDialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    <!--分配权限-->
    <el-dialog title="分配权限" v-model="setMenuDialogVisible" width="20%" @close="setRightDialogClosed">
      <el-tree :data="menuList" :props="treeProps" show-checkbox node-key="id"
               :default-checked-keys="defKeys" ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="allotMenus">确 定</el-button>
                <el-button type="primary" @click="setMenuDialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
  </el-card>
</template>




<script>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css';
export default {
  components: { Treeselect },
  data() {
    return {
      statusList: [{
        value: '1',
        label: '启用'
      }, {
        value: '2',
        label: '停用'
      }],
      queryParams: {},
      Loading: false,
      roleList: [],
      total: 0,
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleKey: '',
        description: '',
        status: 1
      },
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请角色权限标识', trigger: 'blur' }],
        status: [{ required: true, message: '请输入角色状态', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      editRoleDialogVisible: false,
      roleInfo: {},
      editRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请输入角色权限标识', trigger: 'blur' }],
        status: [{ required: true, message: '请输入角色状态', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      setMenuDialogVisible: false,
      menuList: [],
      treeProps: {
        label: 'label'
      },
      defKeys: [],
      id: '',
    }
  },
  methods: {
    // 列表
    async getRoleList() {
      this.Loading = true
      const { data: res } = await this.$api.queryRoleList(this.queryParams)
      if (res.code !== 200) {
        this.$message.error(res.message);
      } else {
        this.roleList = res.data.list
        this.total = res.data.total
        this.Loading = false
      }
    },
    // 搜索
    handleQuery() {
      this.getRoleList()
    },
    // 重置
    resetQuery() {
      this.queryParams = {}
      this.getRoleList()
      this.$message.success("重置成功")
    },
    // pageSize
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getRoleList()
    },
    // pageNum
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getRoleList()
    },
    // 启用/停用
    async roleUpdateStatus(row) {
      let text = row.status === 2 ? "停用" : "启用"
      const confirmResult = await this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        await this.getRoleList()
        return this.$message.info('已取消删除')
      }
      await this.$api.updateRoleStatus(row.id, row.status)
      return this.$message.success(text + "成功")
      // eslint-disable-next-line no-unreachable
      await this.getRoleList()
    },
    // 监听添加角色对话框关闭
    addRoleDialogClosed() {
      this.$refs.addRoleFormRefForm.resetFields()
    },
    // 新增
    addRole() {
      this.$refs.addRoleFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.addRole(this.addRoleForm);
        if (res.code !== 200) {
          this.$message.error(res.message);
        } else {
          this.$message.success("新增角色成功")
          this.addRoleDialogVisible = false
          await this.getRoleList()
        }
      })
    },
    // 监听修改角色对话框的关闭事件
    editRoleDialogClosed() {
      this.$refs.editRoleFormRefForm.resetFields()
    },
    // 展示修改对话框
    async showEditRoleDialog(id) {
      const { data: res } = await this.$api.roleInfo(id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.roleInfo = res.data
        this.editRoleDialogVisible = true
      }
    },
    // 修改角色信息并提交
    editRole() {
      this.$refs.editRoleFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.roleUpdate(this.roleInfo)
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.editRoleDialogVisible = false
          await this.getRoleList()
          this.$message.success("修改角色成功")
        }
      })
    },
    // 删除角色
    async handleRoleDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除角色为"' + row.roleName + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteRole(row.id)
      console.log(row.id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getRoleList()
      }
    },
    // 展示分配菜单权限对话框
    async showSetMenuDialog(role) {
      this.id = role.id
      this.setMenuDialogVisible = true

      try {
        const [menuRes, roleMenuRes] = await Promise.all([
          this.$api.querySysMenuVoList(),
          this.$api.QueryRoleMenuIdList(role.id)
        ])

        if (menuRes.data.code === 200) {
          this.menuList = this.$handleTree.handleTree(menuRes.data.data, 'id')
        }

        if (roleMenuRes.data.code === 200) {
          this.defKeys = roleMenuRes.data.data
        }

        // 【关键修复】等待 menuList 渲染完成后才设置勾选
        this.$nextTick(() => {
          this.$refs.treeRef.setCheckedKeys(this.defKeys)
          console.log('实际已勾选:', this.$refs.treeRef.getCheckedKeys())
        })

      } catch (e) {
        console.error('加载权限失败', e)
      }
    }
    ,
    // 监听对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 分配菜单权限
    async allotMenus() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$api.AssignPermissions(this.id, keys)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('分配权限成功')
        await this.getRoleList()
        this.setMenuDialogVisible = false
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>



<style scoped>

</style>
