<template>
  <div class="login_container">
    <div class="login_box">
      <el-form class="login_form" ref="loginFormRef" :rules="rules" :model="loginForm">
        <div class="title">devops运维管理平台</div>
        <el-form-item prop="username">
          <el-input placeholder="账号" prefix-icon="el-icon-user-solid" v-model="loginForm.username"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="密码" prefix-icon="el-icon-key" v-model="loginForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item prop="image">
          <el-input placeholder="验证码" prefix-icon="el-icon-view" style="width: 200px; float: left;" maxlength="6"
                    v-model="loginForm.image" clearable />
          <el-image class="captchaImg" style="width: 150px; float: left;" :src="image" @click="getCaptcha" />
        </el-form-item>
        <el-form-item>
          <div class="btn-group">
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-button type="primary" style="width: 100%; font-size: large;"
                           @click="loginBtn">登录</el-button>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-button type="info" style="width: 100%; font-size: large;"
                           @click="resetLoginForm">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    // 表单数据规则校验
    return {
      image: '',
      rules: {
        username: [
          {
            required: true, message: "请输入账号", trigger: "blur"
          }
        ],
        password: [
          {
            required: true, message: "请输入密码", trigger: "blur"
          }
        ],
        image: [
          {
            required: true, message: "请输入验证码", trigger: "blur"
          }
        ]
      },
      loginForm: {
        username: '',
        password: '',
        image: '',
        idKey: ''
      }
    }
  },
  methods: {
    // 获取验证码
    async getCaptcha() {
      const { data: res } = await this.$api.captcha()
      // console.log("获取验证码res数据：", res)
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.image = res.data.image
        this.loginForm.idKey = res.data.idKey
      }
    },
    // 登录按钮实现逻辑
// 登录按钮实现逻辑
    loginBtn() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$api.login(this.loginForm)

          console.log("【Login.vue】登录接口返回完整数据：", res)

          if (res.code !== 200) {
            this.$message.error(res.message)
          } else {
            this.$message.success("登录成功")

            // 打印 res.data 的内容
            console.log("【Login.vue】res.data 内容：", res.data)

            // 分别打印每个字段是否存在
            console.log("sysAdmin:", res.data.sysAdmin)
            console.log("token:", res.data.token)
            console.log("leftMenuList:", res.data.leftMenuList)
            console.log("permissionList:", res.data.permissionList)

            // 提交到 vuex
            this.$store.commit('saveSysAdmin', res.data.sysAdmin)
            this.$store.commit('saveToken', res.data.token)
            this.$store.commit('saveLeftMenuList', res.data.leftMenuList)
            this.$store.commit('savePermissionList', res.data.permissionList)

            await this.$router.push("/home")
          }
        } else {
          return false
        }
      })
    },
    // 重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()  // 重置清空 表单
    }
  },
  created() {
    this.getCaptcha()
  }
}
</script>

<style lang="less" scoped>
// 登录页面样式
.login_container {
  background-image: url("../assets/image/img.png");  // 背景图片
  background-size: cover; // 填充
  height: 100%; // 填充
// 登录框
  .login_box {
    width: 400px;
    height: 330px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 5px 20px 0 #e8e8e8;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); // 居中
// 表单
    .login_form {
      position: absolute; // 绝对定位
      bottom: 0;  // 底部对齐
      padding: 0 20px;  // 内边距
      box-sizing: border-box; // 盒模型
      width: 100%;
// 标题
      .title {
        font-size: 30px;  // 字体大小
        line-height: 2;  // 行高
        text-align: center; // 居中
        margin-bottom: 30px; // 底部间距
        font-weight: bold; // 加粗
        //font-style: italic; //
      }
// 验证码图片
      .captchaImg {
        height: 38px;
        width: 100%;
        border: 1px solid #e6e6e6;
        margin-left: 8px;
      }
      // 按钮
      .btn-group {
        display: flex;  // 横向
        justify-content: center;  // 居中
        gap: 50px;  // 间距
        width: 100%;// 宽度
      }
    }
  }
}
</style>
