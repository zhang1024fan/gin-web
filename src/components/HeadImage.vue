<template>
  <!-- 头像组件 -->
  <div class="user-info">
    <span class="user-username">{{ sysAdmin.username }}</span>

    <el-dropdown trigger="click" @command="handleCommand">
      <!-- 头像 -->
      <img
          :src="sysAdmin.icon || require('./../assets/image/touxiang.jpg')"
          alt="头像"
          class="user-avatar"
          @error="useDefaultAvatar"
      />

      <!-- 下拉菜单 -->
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import storage from '@/utils/storage';

export default {
  name: "HeadImage",
  data() {
    return {
      sysAdmin: storage.getItem("sysAdmin") || {}
    };
  },
  methods: {
    // 图片加载失败时使用默认头像
    useDefaultAvatar(e) {
      e.target.src = require('./../assets/image/touxiang.jpg');
    },
    // 菜单点击事件
    handleCommand(command) {
          if (command === 'logout') {
              // 调用新的 logout 方法
              this.logout();
            } else if (command === 'profile') {
              this.$router.push('/system/personal'); // 跳转到个人页面路由
            }
          },
          // 退出登录
          async logout() {
            const confirmResult = await this.$confirm('确定要退出登录吗, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') {
              return this.$message.info('已取消退出')
            }
            // 清除本地存储并跳转到登录页
            this.$storage.clearAll()
            this.$router.push('/login')
            this.$message.success('退出成功')
          }
  }
};
</script>

<style lang="less" scoped>
.user-info {
  position: fixed;
  right: 30px;
  top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-username {
  font-size: medium;
}

.user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 圆形头像 */
  object-fit: cover; /* 防止变形 */
}
</style>
