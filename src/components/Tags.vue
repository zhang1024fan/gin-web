<template>
  <!-- 标签组件 -->
  <div class="tags">
    <el-tag class="tag" size="medium" :effect="item.title == $route.meta.tTitle ? 'dark' : 'plain'"
            v-for="(item, index) in tags" :key="item.path" @click="goTo(item.path)" @close="close(index)"
            :closable="index > 0">
            <i class="circular" v-show="item.title == $route.meta.tTitle"></i>
            {{item.title}}
    </el-tag>
  </div>
</template>

<script>
import index from "vuex";

export default {
  name: "Tags",
  computed: {
    index() {
      return index
    }
  },
  data() {
    return {
      tags: [{
        path: "/dashboard",
        title: "仪表盘",
      }]
      }
        },
    watch: {
      $route: {
        immediate: true,
        handler(val) {
          const boolean = this.tags.find(item => {
            return val.path == item.path
          })
          if (!boolean) {
            this.tags.push({
              title: val.meta.tTitle,
              path: val.path
            })
          }
        }
      }
    },
  methods: {
    // 路由跳转到指定位置
    goTo(path) {
      this.$router.push(path)
    },
    // 点击关闭标签
    close(i) {
      this.tags.splice(i, 1)
    }

  }
}
</script>

<style>
.tags {
    padding-left: 20px;
    padding-top: 2px;
    padding-bottom: 2px;
}
.tag {
  cursor: pointer;
  margin-right: 3px;
}
.circular {
  width: 8px;
  height: 8px;
  margin-right: 4px;
  background-color: #fff;
  border-radius: 50%;
  display: inline-block;
}
</style>
