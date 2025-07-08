<template>
  <el-card>
    <el-form :inline="true" :model="queryParams">
      <el-form-item prop="menuName" label="菜单名称">
        <el-input placeholder="请输入菜单名称" clearable size="mini" @keyup.enter.native="handleQuery"
                  v-model="queryParams.menuName" />
      </el-form-item>
      <el-form-item prop="menuStatus" label="菜单状态">
        <el-select size="mini" placeholder="菜单状态" v-model="queryParams.menuStatus" style="width: 100px;">
          <el-option v-for="item in menuStatusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" size="mini" @click="addMenuDialogVisible = true" v-authority="['base:menu:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" size="mini" @click="toggleExpandAll">展开/折叠
        </el-button>
      </el-col>
    </el-row>
    <el-table border stripe :header-cell-style="{ background: '#eef1f6', color: '#606266' }" v-if="refreshTable"
              v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
              :tree-props="{ children: 'children' }">
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="icon" label="图标">
        <template v-slot="scope">
          <el-icon>
            <component :is="scope.row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="value" label="权限标识" />
      <el-table-column prop="url" label="组件路径" />
      <el-table-column prop="menuType" label="菜单类型">
        <template v-slot="scope">
          <el-tag v-if="scope.row.menuType === 1">目录</el-tag>
          <el-tag v-else-if="scope.row.menuType === 2" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 3" type="danger">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="menuStatus" label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.menuStatus === 2" type="success">启用</el-tag>
          <el-tag v-else-if="scope.row.menuStatus === 1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="更多操作" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="showEditMenuDialog(scope.row.id)" v-authority="['base:menu:edit']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleMenuDelete(scope.row)" v-authority="['base:admin:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增菜单-->
    <el-dialog title="新增菜单" v-model="addMenuDialogVisible" width="30%" @close="addMenuDialogClosed">
      <el-form :model="menuForm" :rules="addMenuFormRules" ref="addMenuFormRefForm" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item size="mini" label="上级菜单" prop="parentId" v-if="menuForm.menuType != 1">
              <treeselect :options="treeList" placeholder="请选择上级菜单" v-model="menuForm.parentId" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType != 3">
              <el-select v-model="menuForm.icon">
                <el-option v-for="item in iconList" :key="item.value" :label="item.label" :value="item.value">
                    <span style="display: flex; align-items: center;">
                      <el-icon style="font-size: 20px;">
                        <component :is="item.value" />
                      </el-icon>
                      <span style="margin-left: 8px;">{{ item.label }}</span>
                    </span>
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuForm.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="menuForm.menuType != 3">
            <el-form-item label="菜单url" prop="url">
              <el-input v-model="menuForm.url" placeholder="请输入菜单url" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 1" label="权限标识" prop="value">
              <el-input v-model="menuForm.value" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 3" label="显示状态" prop="menuStatus">
              <el-radio-group v-model="menuForm.menuStatus">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMenu">确 定</el-button>
        <el-button type="primary" @click="addMenuDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改菜单-->
    <el-dialog title="修改菜单" v-model="editMenuDialogVisible" width="30%" @close="editMenuDialogClosed">
      <el-form :model="menuInfo" :rules="editMenuFormRules" ref="editMenuFormRefForm" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuInfo.menuType">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item size="mini" label="上级菜单" prop="parentId" v-if="menuInfo.menuType != 1">
              <treeselect :options="treeList" placeholder="请选择上级菜单" v-model="menuInfo.parentId" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单图标" prop="icon" v-if="menuInfo.menuType != 3">
              <el-select v-model="menuInfo.icon">
                <el-option v-for="item in iconList" :key="item.value" :label="item.label" :value="item.value">
                    <span style="display: flex; align-items: center;">
                      <el-icon style="font-size: 20px;">
                        <component :is="item.value" />
                      </el-icon>
                      <span style="margin-left: 8px;">{{ item.label }}</span>
                    </span>
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuInfo.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuInfo.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="menuInfo.menuType != 3">
            <el-form-item label="菜单url" prop="url">
              <el-input v-model="menuInfo.url" placeholder="请输入菜单url" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuInfo.menuType != 1" label="权限标识" prop="value">
              <el-input v-model="menuInfo.value" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuInfo.menuType != 3" label="显示状态" prop="menuStatus">
              <el-radio-group v-model="menuInfo.menuStatus">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editMenu">确 定</el-button>
        <el-button type="primary" @click="editMenuDialogVisible = false">取 消</el-button>
      </div>
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
      queryParams: {},
      menuStatusList: [{
        value: '2',
        label: '启用'
      }, {
        value: '1',
        label: '停用'
      }],
      loading: true,
      menuList: [],
      isExpandAll: false,
      refreshTable: true,
      iconList: [
        {value: 'HomeFilled', label: 'HomeFilled'},
        {value: 'UploadFilled', label: 'UploadFilled'},
        {value: 'Menu', label: 'Menu'},
        {value: 'Search', label: 'Search'},
        {value: 'Edit', label: 'Edit'},
        {value: 'Delete', label: 'Delete'},
        {value: 'More', label: 'More'},
        {value: 'Star', label: 'Star'},
        {value: 'StarFilled', label: 'StarFilled'},
        {value: 'Platform', label: 'Platform'},
        {value: 'TrendCharts', label: 'TrendCharts'},
        {value: 'Document', label: 'Document'},
        {value: 'Eleme', label: 'Eleme'},
        {value: 'Delete', label: 'Delete'},
        {value: 'Tools', label: 'Tools'},
        {value: 'Setting', label: 'Setting'},
        {value: 'User', label: 'User'},
        {value: 'Phone', label: 'Phone'},
        {value: 'Goods', label: 'Goods'},
        {value: 'Help', label: 'Help'},
        {value: 'Picture', label: 'Picture'},
        {value: 'Upload', label: 'Upload'},
        {value: 'Download', label: 'Download'},
        {value: 'Promotion', label: 'Promotion'},
        {value: 'Shop', label: 'Shop'},
        {value: 'menu', label: 'Menu'},
        {value: 'share', label: 'hare'},
        {value: 'bottom', label: 'Bottom'},
        {value: 'top', label: 'Top'},
        {value: 'key', label: 'Key'},
        {value: 'unlock', label: 'Unlock'},
        {value: 'shopping-cart-full', label: 'ShoppingCartFull'},
        {value: 'sell', label: 'Sell'},
        {value: 'present', label: 'Present'},
        {value: 'box', label: 'Box'},
        {value: 'wallet', label: 'Wallet'},
        {value: 'discount', label: 'Discount'},
        {value: 'price-tag', label: 'PriceTag'},
        {value: 'guide', label: 'Guide'},
        {value: 'connection', label: 'Connection'},
        {value: 'chat-dot-round', label: 'ChatDotRound'}
      ],
      addMenuDialogVisible: false,
      menuForm: {
        menuStatus: 2
      },
      addMenuFormRules: {
        menuType: [{ required: true, message: "菜单类型不能为空", trigger: "blur" }],
        menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
        value: [{ required: true, message: "权限标识不能为空", trigger: "blur" }]
      },
      treeList: [],
      editMenuDialogVisible: false,
      menuInfo: [],
      editMenuFormRules: {
        menuType: [{ required: true, message: "菜单类型不能为空", trigger: "blur" }],
        menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
        value: [{ required: true, message: "权限标识不能为空", trigger: "blur" }]
      },
    }
  },
  methods: {
    // 列表
    async getMenuList() {
      this.loading = true;
      const { data: res } = await this.$api.queryMenuList(this.queryParams)
      // console.log(res)
      if (res.code !== 200) {
        this.$message.error(res.message);
      } else {
        this.menuList = this.$handleTree.handleTree(res.data, "id");
        this.loading = false;
      }
    },
    // 搜索
    handleQuery() {
      this.getMenuList();
    },
    // 重置
    resetQuery() {
      this.queryParams = {}
      this.getMenuList();
      this.$message.success("重置成功")
    },
    // 展开/折叠
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 新增菜单关闭事件
    addMenuDialogClosed() {
      this.$refs.addMenuFormRefForm.resetFields()
    },
    // 新增下拉列表
    async getMenuVoList() {
      const { data: res } = await this.$api.querySysMenuVoList()
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.treeList = this.$handleTree.handleTree(res.data, "id")
      }
    },
    // 新增操作
    addMenu() {
      this.$refs.addMenuFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.addMenu(this.menuForm);
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.$message.success("新增菜单成功")
          this.addMenuDialogVisible = false
          await this.getMenuList()
          await this.getMenuVoList()
        }
      })
    },
    // 监听修改菜单关闭事件
    editMenuDialogClosed() {
      this.$refs.editMenuFormRefForm.resetFields()
    },
    // 打开菜单
    async showEditMenuDialog(id) {
      const { data: res } = await this.$api.menuInfo(id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.menuInfo = res.data
        this.editMenuDialogVisible = true
      }
    },
    // 修改菜单
    editMenu() {
      this.$refs.editMenuFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.menuUpdate(this.menuInfo)
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.editMenuDialogVisible = false
          await this.getMenuList()
          this.$message.success("修改菜单成功")
        }
      })
    },
    // 删除菜单
    async handleMenuDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除菜单为"' + row.menuName + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.menuDelete(row.id)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功')
        await this.getMenuList()
      }
    },
  },
  created() {
    this.getMenuList()
    this.getMenuVoList()
  }
}
</script>

<style lang="less" scoped></style>
