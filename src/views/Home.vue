<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="logo">
        <img src="../assets/image/logo1.jpg" class="siderbar-logo">
        <h3 v-show="!isCollapse">devops管理系统</h3>
      </div>
      <el-menu background-color="#000c17" text-color="#FFFFFFA6" active-text-color="#ffd04b" router :default-active="$route.path"
               :collapse="isCollapse" :collapse-transition="false">
        <!--无子集菜单-->
        <el-menu-item :index="'/' + item.url" v-for="item in noChildren" :key="item.menuName" @click="saveNavState('/' + item.url)">
          <el-icon><component :is="item.icon" /></el-icon>
          <template v-slot:title>
            <span>{{ item.menuName }}</span>
          </template>
        </el-menu-item>
        <!--有子集菜单-->
        <el-sub-menu :index="item.id + ''" v-for="item in hasChildren" :key="item.id">
          <template #title>
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.menuName }}</span>
          </template>
          <el-menu-item :index="'/' + subItem.url" v-for="subItem in item.menuSvoList" :key="subItem.id"
                        @click="saveNavState('/' + subItem.url)">
            <el-icon><component :is="subItem.icon" /></el-icon>
            <template #title>
              <span>{{ subItem.menuName }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>

      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-container>
      <el-header height="50px">
        <!-- 顶部导航栏,折叠图标 -->
        <div class="fold-btn">
          <el-button type="text" @click="toggleCollapse" class="collapse-btn">
            <el-icon size="24"><component :is="collapseBtnClass" /></el-icon>
          </el-button>
          <HeadImage />
        </div>
        <div class="bread-btn">
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">仪表盘</el-breadcrumb-item>

            <!-- 显示二级标题 -->
            <el-breadcrumb-item v-if="$route.meta && $route.meta.sTitle">
              {{ $route.meta.sTitle }}
            </el-breadcrumb-item>

            <!-- 显示三级标题 -->
            <el-breadcrumb-item v-if="$route.meta && $route.meta.tTitle">
              {{ $route.meta.tTitle }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <HeadImage />
      </el-header>
      <Tags />
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>


import storage from "@/utils/storage";
import HeadImage   from "@/components/HeadImage.vue";
import Tags from "@/components/Tags.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: { HeadImage, Tags },
  data() {
    return {
      leftMenuList: storage.getItem("leftMenuList"),
      activePath: '',
      collapseBtnClass: "Fold",
      isCollapse: false,
    }
  },
  computed: {
    // 无子集
    noChildren() {
      return this.leftMenuList.filter(item => !item.menuSvoList) // 过滤无子集
    },
    // 有子集
    hasChildren() {
      return this.leftMenuList.filter(item => item.menuSvoList)
    }
  },
  methods: {
    // 点击实现跳转
    saveNavState(activePath) {
      storage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 张开和折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.collapseBtnClass = 'Fold'  // 折叠
      } else {
        this.collapseBtnClass = 'Expand'  // 展开
      }
    }
  },
  mounted() {
    console.log('leftMenuList:', this.leftMenuList);
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-aside {
    background-color: #000c17;

    .logo {
      margin-top: 8px;
      display: flex;
      align-items: center;
      font-size: 13px;
      height: 50px;
      color: #fff;
      font-style: italic;

      .siderbar-logo {
        width: 50px;
        height: 40px;
        margin: 0 16px;
      }
    }

    .el-menu {
      border-right: none;
    }
  }
  .el-menu {
    // 一级菜单：没有子菜单的项（如“仪表盘”）
    > .el-menu-item.is-active {
      background-color: #1890ff !important;
      color: #fff !important;
      border-radius: 10px;
      margin: 0 5px;
      width: calc(100% - 10px);
    }

    // 二级菜单项激活样式
    .el-sub-menu .el-menu-item.is-active {
      background-color: #1890ff !important;
      color: #fff !important;
      border-radius: 10px;
      margin: 0 5px;
      width: calc(100% - 10px);
    }

    // 有子菜单的一级菜单（不应用激活样式）
    > .el-sub-menu.is-active,
    > .el-sub-menu.is-opened {
      background-color: transparent !important;
      color: inherit !important;
    }
  }




  .el-header {
    background-color: #f9fafc;
    align-items: center;
    justify-content: space-between;
    display: flex;


    .fold-btn {
      padding-top: 2px;
      font-size: 23px;
      cursor: pointer;
    }

    .bread-btn {
      padding-top: 2px;
      position: fixed;
      margin-left: 40px;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>
