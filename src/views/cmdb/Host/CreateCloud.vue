<template>
  <el-dialog
    :model-value="visible"
    width="40%"
    title="导入云主机"
    @update:model-value="val => $emit('update:visible', val)"
    @close="dialogClose"
  >
    <el-steps :active="active" align-center style="margin-bottom: 10%">
      <el-step title="选择云服务商" />
      <el-step title="输入凭据并确认" />
    </el-steps>

    <el-form :model="form" ref="formRef" :rules="formRules" label-position="right" label-width="155px">
      <!--第一步-->
      <div v-show="active == 1">
        <el-form-item prop="cloud" label-width="0px" style="margin-left: 25%">
          <el-radio-group v-model="form.cloud">
            <el-radio label="aliyun"><img src="@/assets/image/aliyun.png" style="width: 60px; height: 60px; vertical-align: middle"></el-radio>
            <el-radio label="tencent"><img src="@/assets/image/tengxun.png" style="width: 60px; height: 60px; vertical-align: middle"></el-radio>
            <el-radio label="baidu"><img src="@/assets/image/baidu.png" style="width: 60px; height: 60px; vertical-align: middle"></el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <!--第二步-->
      <div v-show="active == 2">
        <el-form-item label="AccessKey ID：" prop="secret_id">
          <el-input v-model="form.secret_id" clearable></el-input>
        </el-form-item>
        <el-form-item label="AccessKey Secret：" prop="secret_key">
          <el-input v-model="form.secret_key" clearable></el-input>
          <el-link v-if="form.cloud == 'aliyun'" href="https://ram.console.aliyun.com/manage/ak" target="_blank" type="primary">如何获取AccessKey？</el-link>
          <el-link v-if="form.cloud == 'tencent'" href="https://console.cloud.tencent.com/cam/capi" target="_blank" type="primary">如何获取AccessKey？</el-link>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose" v-if="active == 1" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="dialogToggle('pre')" v-if="active > 1">上一步</el-button>
        <el-button type="primary" @click="submit" v-if="active == 2">确认导入</el-button>
        <el-button type="primary" @click="dialogToggle('next')" v-if="active < 2">下一步</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "CreateCloud",
  props: {
    visible: Boolean,
  },
  data() {
    const savedForm = JSON.parse(localStorage.getItem('cloudHostForm') || '{}')
    return {
      active: 1,
      form: {
        'cloud': savedForm.cloud || '',
        'secret_id': savedForm.secret_id || '',
        'secret_key': savedForm.secret_key || ''
      },
      formRules: {
        cloud: [
          {required: true, message: '请选择', trigger: 'blur'}
        ],
        secret_id: [
          {required: true, message: '请输入密钥ID', trigger: 'blur'},
          {min: 20, message: '密钥ID长度应不小于20个字符', trigger: 'blur'}
        ],
        secret_key: [
          {required: true, message: '请输入密钥Key', trigger: 'blur'},
          {min: 20, message: '密钥Key长度应不小于20个字符', trigger: 'blur'}
        ]
      },
      // 腾讯云API参数映射
      tencentParamMap: {
        secret_id: 'accessKey',
        secret_key: 'secretKey'
      }
    }
  },
  methods: {
    dialogClose() {
      console.log('[CreateCloud] 对话框关闭事件触发')
      localStorage.setItem('cloudHostForm', JSON.stringify(this.form))
      this.$emit('update:visible', false)
      this.resetForm()
    },
    resetForm() {
      console.log('[CreateCloud] 重置表单状态')
      this.form = {
        'cloud': '',
        'secret_id': '',
        'secret_key': ''
      }
      this.active = 1
    },
    dialogToggle(action) {
      console.log(`[CreateCloud] 对话框切换: ${action}`)
      if (action === 'pre') {
        if (this.active-- < 2) {
          this.active = 1
        }
      } else if (action === 'next') {
        if (this.active === 1 && !this.form.cloud) {
          this.$message.warning('请先选择云服务商')
          return
        }
        if (this.active++ > 2) {
          this.active = 1
        }
      }
    },
    async submit() {
      try {
        console.log('[CreateCloud] 开始验证表单...')
        await this.$refs.formRef.validate()
        
        console.log('[CreateCloud] 表单验证通过，开始导入云主机...')
        let res
        if(this.form.cloud === 'aliyun') {
          console.log('[CreateCloud] 导入阿里云主机...')
          res = await this.$api.hostcloudcreatealiyun(this.form)
        } else if(this.form.cloud === 'tencent') {
          console.log('[CreateCloud] 导入腾讯云主机...')
          // 腾讯云API需要特定参数格式
          const tencentParams = {
            accessKey: this.form.secret_id,
            secretKey: this.form.secret_key
          }
          res = await this.$api.hostcloudcreatetencent(tencentParams)
        }

        this.$message.success('导入成功')
        console.log('[CreateCloud] 导入成功，重置表单状态...')
        this.resetForm()
        console.log('[CreateCloud] 触发success事件...')
        this.$emit('success', { 
          success: true,
          cloud: this.form.cloud,
          shouldClose: true
        })
        this.$emit('update:visible', false) // 确保对话框关闭
      } catch (error) {
        console.error('[CreateCloud] 导入失败:', error)
        if (!error.response || error.response.status !== 200) {
          this.$message.error('导入失败: ' + (error.message || '未知错误'))
        }
        this.$emit('success', {
          success: false,
          error: error.message
        })
      }
    }
  }
}
</script>

<style scoped>
.cancel-btn {
  margin-right: 10px;
}
</style>
