<template>
  <el-card>
    <!--搜索-->
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="部门名称">
        <el-input placeholder="请输入部门名称" clearable size="mini" v-model="queryParams.deptName"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门状态">
        <el-select size="mini" placeholder="部门状态"  v-model="queryParams.deptStatus" style="width: 100px;" >
          <el-option v-for="item in deptStatusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
                   @click="addDeptDialogVisible = true" v-authority="['base:dept:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain type="info" icon="Sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table border stripe :header-cell-style="{ background: '#eef1f6', color: '#606266' }" v-if="refreshTable"
              v-loading="loading" :data="deptList" row-key="id" :default-expand-all="isExpandAll"
              :tree-props="{ children: 'children' }">
      <el-table-column label="部门名称" prop="deptName" />
      <el-table-column label="部门类型" prop="deptType">
        <template v-slot="scope">
          <el-tag v-if="scope.row.deptType === 1">公司</el-tag>
          <el-tag v-else-if="scope.row.deptType === 2" type="success">中心</el-tag>
          <el-tag v-else-if="scope.row.deptType === 3" type="danger">部门</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部门状态" prop="deptStatus">
        <template v-slot="scope">
          <el-tag v-if="scope.row.deptStatus === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.deptStatus === 2" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="更多操作" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="Edit" @click="showEditDeptDialog(scope.row.id)" v-authority="['base:dept:edit']">修改
          </el-button>
          <el-button size="mini" type="text" icon="Delete" @click="handleDeptDelete(scope.row)"
                     :disabled="scope.row.deptType == '1' ? true : false" v-authority="['base:dept:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增部门-->
    <el-dialog title="新增部门" v-model="addDeptDialogVisible" width="30%" @close="addDeptDialogClosed">
      <el-form :model="addDeptForm" :rules="addDeptFormRules" ref="addDeptFormRefForm" label-width="80px">
        <el-form-item label="部门类型" prop="deptType">
          <el-radio-group v-model="addDeptForm.deptType">
            <el-radio :label="1">公司</el-radio>
            <el-radio :label="2">中心</el-radio>
            <el-radio :label="3">部门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="mini" label="上级部门" prop="parentId" v-if="addDeptForm.deptType != 1">
          <treeselect :options="optionsDeptList" placeholder="请选择上级部门" v-model="addDeptForm.parentId" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="addDeptForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="部门状态" prop="deptStatus" >
          <el-radio-group v-model="addDeptForm.deptStatus">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addDept">确 定</el-button>
                <el-button type="primary" @click="addDeptDialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    <!--修改部门-->
    <el-dialog title="编辑部门" v-model="editDeptDialogVisible" width="30%">
      <el-form :model="deptInfo" :rules="editDeptFormRules" ref="editDeptFormRefForm" label-width="80px">
        <el-form-item label="部门类型" prop="deptType">
          <el-radio-group v-model="deptInfo.deptType">
            <el-radio :label="1">公司</el-radio>
            <el-radio :label="2">中心</el-radio>
            <el-radio :label="3">部门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="mini" label="上级部门" prop="parentId" v-if="deptInfo.deptType != 1">
          <treeselect :options="optionsDeptList" placeholder="请选择上级部门" v-model="deptInfo.parentId" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptInfo.deptName"></el-input>
        </el-form-item>
        <el-form-item label="部门状态" prop="deptStatus">
          <el-radio-group v-model="deptInfo.deptStatus">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editDept">确 定</el-button>
                <el-button type="primary" @click="editDeptDialogVisible = false">取 消</el-button>
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
      deptStatusList: [{
        value: '2',
        label: '停用'
      }, {
        value: '1',
        label: '正常'
      }],
      queryParams: {},
      loading: true,
      deptList: [],
      refreshTable: true,
      isExpandAll: true,
      optionsDeptList: [],
      addDeptDialogVisible: false,
      addDeptFormRules: {
        deptType: [{ required: true, message: "请选择部门类型", trigger: "blur" }],
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      },
      addDeptForm: {
        deptStatus: 1
      },
      editDeptDialogVisible: false,
      deptInfo: {},
      editDeptFormRules: {
        deptType: [{ required: true, message: "请选择部门类型", trigger: "blur" }],
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      }
    }
  },
  methods: {
    // 列表
    async getList() {
      this.loading = true
      const { data: res } = await this.$api.queryDeptList(this.queryParams)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.deptList = this.$handleTree.handleTree(res.data, "id")
        this.loading = false
      }
    },
    // 搜索
    handleQuery() {
      this.getList()
    },
    // 重置搜索
    resetQuery() {
      this.queryParams = {}
      this.getList()
      this.$message.success("重置成功")
    },
    // 展开和折叠
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 部门下拉列表
    async getDeptVoList() {
      const { data: res } = await this.$api.querySysDeptVoList()
      // console.log(res)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.optionsDeptList = this.$handleTree.handleTree(res.data, "id")
      }
    },
    // 监听新增部门对话框
    addDeptDialogClosed() {
      this.$refs.addDeptFormRefForm.resetFields()
    },
    // 新增
    addDept() {
      this.$refs.addDeptFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.addDept(this.addDeptForm);
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.$message.success('新增部门成功')
          this.addDeptDialogVisible = false
          await this.getList()
          await this.getDeptVoList()
        }
      })
    },
    // 展示编辑对话框
    async showEditDeptDialog(id) {
      const { data: res } = await this.$api.deptInfo(id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.deptInfo = res.data
        this.editDeptDialogVisible = true
      }
    },
    // 监听编辑部门
    editDeptDialogClosed() {
      this.$refs.editDeptFormRefForm.resetFields()
    },
    // 修改部门信息并提交
    editDept() {
      this.$refs.editDeptFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.deptUpdate(this.deptInfo)
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.editDeptDialogVisible = false
          await this.getList()
          this.$message.success("修改部门成功")
        }
      })
    },
    // 删除部门
    async handleDeptDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除部门为"' + row.deptName + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteDept(row.id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getList()
      }
    }
  },
  created() {
    this.getList()
    this.getDeptVoList()
  }
}
</script>

<style lang="less" scoped></style>
