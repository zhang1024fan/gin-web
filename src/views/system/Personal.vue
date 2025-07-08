<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <div>
          <div style="text-align: center">
            <el-avatar :src="adminDetail.icon"></el-avatar>
          </div>
          <el-form label-width="100px" size="mini">
            <el-row>
              <el-col :span="24">
                <el-form-item label="用户账号：">{{ adminDetail.username }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户昵称：">{{ adminDetail.nickname }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户邮箱：">{{ adminDetail.email }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户电话：">{{ adminDetail.phone }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户备注：">{{ adminDetail.note }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="创建时间：">{{ adminDetail.createTime }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本资料</span>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本资料" name="first">
            <el-form :model="adminDetail" :rules="editFormRules" ref="editFormRefForm" label-width="80px">
              <el-form-item label="用户头像" prop="icon">
                <el-upload :headers=headers class="avatar-uploader" :action="uploadIconUrl"
                           :show-file-list="false" :on-success="handleAvatarSuccess">
                  <img v-if="icon" :src="icon" class="avatar" title="点击更换头像">
                  <img v-else="!icon" :src="adminDetail.icon" class="avatar" title="点击更换头像">
                </el-upload>
              </el-form-item>
              <el-form-item label="用户账号" prop="username">
                <el-input v-model="adminDetail.username" />
              </el-form-item>
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="adminDetail.nickname" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="adminDetail.phone" maxlength="11" />
              </el-form-item>
              <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="adminDetail.email" maxlength="50" />
              </el-form-item>
              <el-form-item label="用户备注" prop="note">
                <el-input v-model="adminDetail.note" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="submitFirst">保存</el-button>
                <el-button type="danger" size="mini" @click="closeFirst">关闭</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRefForm" label-width="80px">
              <el-form-item label="旧密码" prop="password">
                <el-input v-model="updateForm.password" placeholder="请输入旧密码" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="updateForm.newPassword" placeholder="请输入新密码" />
              </el-form-item>
              <el-form-item label="确认密码" prop="resetPassword">
                <el-input v-model="updateForm.resetPassword" placeholder="请确认密码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="submitSecond">保存</el-button>
                <el-button type="danger" size="mini" @click="closeSecond">关闭</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import storage from '@/utils/storage'

export default {
  data() {
    return {
      adminDetail: storage.getItem("sysAdmin"),
      activeName: 'first',
      uploadIconUrl: 'http://127.0.0.1:8000/api/upload',
      headers: {
        Authorization: "Bearer " + storage.getItem("token"),
      },
      icon: '',
      editFormRules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入用户手机', trigger: 'blur' }],
        note: [{ required: true, message: '请输入用户备注', trigger: 'blur' }],
      },
      updateForm: {
        password: '',
        newPassword: '',
        resetPassword: ''
      },
      updateFormRules: {
        password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        resetPassword: [{ required: true, message: '请输入重复密码', trigger: 'blur' }],
      }
    }
  },
  methods: {
    // 成功调用图片信息
    handleAvatarSuccess(res) {
      this.icon = res.data;
    },
    // 修改个人信息
    submitFirst() {
      this.$refs.editFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.adminUpdatePersonal({
          icon: this.icon === '' ? this.adminDetail.icon : this.icon,
          username: this.adminDetail.username,
          email: this.adminDetail.email,
          nickname: this.adminDetail.nickname,
          phone: this.adminDetail.phone,
          note: this.adminDetail.note,
        })
        if (res.code !== 200) {
          this.$message.error(res.message);
        } else {
          this.$storage.clearItem("sysAdmin")
          this.$store.commit('saveSysAdmin', res.data)
          await this.$router.push('/home')
          this.$message.success('修改用户成功')
        }
      })
    },
    closeFirst() {
      this.$router.push('/home')
    },
    // 修改个人密码
    submitSecond() {
      this.$refs.updateFormRefForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.adminUpdatePersonalPassword({
          password: this.updateForm.password,
          newPassword: this.updateForm.newPassword,
          resetPassword: this.updateForm.resetPassword
        })
        if (res.code !== 200) {
          this.$message.error(res.message);
        } else {
          this.$storage.clearAll()
          this.$router.push("/login")
          this.$message.success('修改密码成功')
        }
      })
    },
    // 关闭页面跳转到首页
    closeSecond() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
.el-avatar {
  height: 130px;
  width: 130px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;

  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
}
</style>
