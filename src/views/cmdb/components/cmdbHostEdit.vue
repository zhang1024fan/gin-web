<template>
  <el-dialog title="编辑主机" v-model="dialogVisible" width="40%" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="主机名称" prop="hostName">
            <el-input v-model="form.hostName" placeholder="请输入主机名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属分组" prop="groupId">
            <el-cascader
              v-model="form.groupId"
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
                v-model="form.username" 
                placeholder="用户名" 
                style="width: 120px; margin-right: 8px" 
              />
              <span style="margin: 0 4px">@</span>
              <el-input 
                v-model="form.ip" 
                placeholder="IP地址" 
                style="width: 150px; margin-right: 8px" 
              />
              <span style="margin: 0 4px">-p</span>
              <el-input 
                v-model="form.port" 
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
            <el-select v-model="form.authId" placeholder="请选择认证凭据" style="width: 100%">
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
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    groupList: {
      type: Array,
      required: true
    },
    authList: {
      type: Array,
      required: true
    },
    hostInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        id: '',
        hostName: '',
        ip: '',
        port: 22,
        username: '',
        authId: '',
        groupId: '',
        remark: ''
      },
      rules: {
        hostName: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入连接用户名', trigger: 'blur' }],
        authId: [{ required: true, message: '请选择认证凭据', trigger: 'change' }],
        groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }]
      }
    }
  },
  watch: {
    hostInfo: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.id) {
          this.form = {
            id: newVal.id,
            hostName: newVal.hostName,
            ip: newVal.ip,
            port: newVal.port,
            username: newVal.username,
            authId: newVal.authId,
            groupId: newVal.groupId,
            remark: newVal.remark
          }
        }
      }
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs.formRef.resetFields()
      this.$emit('closed')
    },
    handleGroupChange(value) {
      if (value && value.length > 0) {
        this.form.groupId = value[value.length - 1]
      }
    },
    async submitForm() {
      try {
        await this.$refs.formRef.validate()
        
        const authExists = this.authList.some(auth => auth.id === this.form.authId)
        if (!authExists) {
          return this.$message.error('选择的认证凭据不存在，请刷新凭据列表后重试')
        }

        const requestData = {
          id: this.form.id,
          groupId: this.form.groupId,
          hostName: this.form.hostName,
          remark: this.form.remark,
          sshIp: this.form.ip,
          sshKeyId: this.form.authId,
          sshName: this.form.username,
          sshPort: this.form.port
        }

        this.$emit('submit', requestData)
        this.dialogVisible = false
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
  }
}
</script>

<style scoped>
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
