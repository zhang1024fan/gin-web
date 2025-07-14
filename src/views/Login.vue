<template>
  <div class="login_container">
    <!-- 粒子效果 canvas -->
    <canvas id="particles" class="particles-canvas"></canvas>
    <!-- 黑客代码雨 canvas -->
    <canvas id="matrix" class="matrix-canvas"></canvas>

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
          <div style="display: flex; width: 100%;">
            <el-input placeholder="验证码" prefix-icon="el-icon-view" style="flex: 1;" maxlength="6"
                      v-model="loginForm.image" clearable />
            <el-image class="captchaImg" :src="image" @click="getCaptcha" style="margin-left: 10px;" />
          </div>
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
    return {
      image: '',
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        image: [
          { required: true, message: "请输入验证码", trigger: "blur" }
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
    // 初始化黑客代码雨
    initMatrixRain() {
      const canvas = document.getElementById('matrix')
      const ctx = canvas.getContext('2d')

      canvas.height = window.innerHeight
      canvas.width = window.innerWidth

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~'.split('')
      const fontSize = 16
      const columns = canvas.width / fontSize
      ctx.font = `normal 400 ${fontSize}px monospace`
      const drops = Array(Math.floor(columns)).fill(0)

      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillStyle = '#0f0'
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }
          drops[i]++
        }
      }

      setInterval(draw, 33)
    }

,

    // 获取验证码
    async getCaptcha() {
      const { data: res } = await this.$api.captcha()
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.image = res.data.image
        this.loginForm.idKey = res.data.idKey
      }
    },

    // 登录按钮
    loginBtn() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$api.login(this.loginForm)

          console.log("【Login.vue】登录接口返回完整数据：", res)

          if (res.code !== 200) {
            this.$message.error(res.message)
          } else {
            this.$message.success("登录成功")
            console.log("【Login.vue】res.data 内容：", res.data)

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
      this.$refs.loginFormRef.resetFields()
    },

    // 初始化粒子效果
    initParticles() {
      const canvas = document.getElementById('particles')
      const ctx = canvas.getContext('2d')
      
      // 设置canvas尺寸
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      
      const particles = []
      const particleCount = 200  // 增加粒子数量
      const mouse = { x: null, y: null }
      
      // 监听鼠标移动
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.x
        mouse.y = e.y
      })
      
      // 创建粒子
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 2,  // 增大粒子尺寸
          speedX: Math.random() * 3 - 1.5,
          speedY: Math.random() * 3 - 1.5,
          color: `rgba(200, 200, 200, ${Math.random() * 0.5 + 0.3})`  // 浅灰色粒子
        })
      }
      
      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // 更新和绘制粒子
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          
          // 计算粒子到鼠标的距离
          let dx = mouse.x - p.x
          let dy = mouse.y - p.y
          let distance = Math.sqrt(dx * dx + dy * dy)
          
          // 鼠标吸引力效果
          if (distance < 100) {
            p.speedX += dx * 0.0005
            p.speedY += dy * 0.0005
          }
          
          // 更新位置
          p.x += p.speedX
          p.y += p.speedY
          
          // 边界检查
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
          
          // 绘制粒子
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          
          // 绘制连线
          if (distance < 100) {
            ctx.strokeStyle = 'rgba(220, 220, 220, 0.5)'
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
        
        requestAnimationFrame(animateParticles)
      }
      
      animateParticles()
    }
  },
  mounted() {
    this.getCaptcha()
    this.initMatrixRain()
    this.initParticles()
  }
}
</script>

<style lang="less" scoped>
.matrix-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.3;
  mix-blend-mode: lighten;
}

.particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none; /* 允许鼠标事件穿透 */
}



.login_container {
  position: relative;
  background-image: url("../assets/image/6.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
  z-index: 0;

  .login_box {
    width: 400px;
    height: 330px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 5px 20px 0 #e8e8e8;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2; /* 登录框在 canvas 动画层之上 */

    .login_form {
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;
      width: 100%;

      .title {
        font-size: 30px;
        line-height: 2;
        text-align: center;
        margin-bottom: 30px;
        font-weight: bold;
      }

.captchaImg {
  height: 40px;
  width: 150px;
  border: 1px solid #e6e6e6;
  position: relative;
  z-index: 3;
  background-color: #f8f8f8;
  filter: contrast(1.5) brightness(0.8);
  object-fit: contain;
}

      .btn-group {
        display: flex;
        justify-content: center;
        gap: 50px;
        width: 100%;
      }
    }
  }
}
</style>
