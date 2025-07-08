<template>
  <el-row :gutter="25" class="card-row">
    <el-col :span="6" v-for="(card, index) in cards" :key="index">
      <el-card class="custom-card">
        <!-- 图标 -->
        <div class="icon-wrapper">
          <el-icon :class="['icon', card.icon]" style="font-size: 20px; color: #409EFF;"></el-icon>
        </div>
        <!-- 文字内容 -->
        <div class="content-wrapper">
          <span>{{ card.title }}</span>
          <time class="time">{{ card.value }}</time>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        { title: '用户', value: '100+', icon: 'el-icon-user-solid' },
        { title: '订单', value: '200+', icon: 'el-icon-document' },
        { title: '商品', value: '300+', icon: 'el-icon-shopping-cart-2' },
        { title: '收入', value: '$5000+', icon: 'el-icon-money' }
      ]
    };
  }
};
</script>

<style scoped>
.card-row {
  width: 100%;
  margin: 0 auto;
}

.time {
  font-size: 14px;
  color: #999;
}

.custom-card {
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  width: 100%; /* 确保卡片撑满 el-col 宽度 */
}

/* 卡片内容区域样式 */
.custom-card ::v-deep .el-card__body {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
}

.icon-wrapper {
  margin-right: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content-wrapper span {
  font-size: 13px;
  color: #333;
}
</style>
