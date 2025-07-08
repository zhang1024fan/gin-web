<template>
  <div class="dashboard-container">
    <!-- 四个卡片 -->
    <el-row :gutter="10" style="margin-bottom: 10px;">
      <card-group />
    </el-row>

    <!-- 面积图 -->
    <el-row style="margin-bottom: 10px;">
      <line-chart style="width: 100%;"/>
    </el-row>

    <!-- 南丁格尔玫瑰图、柱状图、半环形图 -->
    <el-row :gutter="10" type="flex" justify="space-between" style="margin-top: 0; margin-bottom: 0;">
      <el-col :span="7">
        <funnel-chart />
      </el-col>
      <el-col :span="7">
        <bar-chart />
      </el-col>
      <el-col :span="7">
        <pie-chart />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CardGroup from './components/CardGroup.vue';
import LineChart from './components/LineChart.vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue'; // 现在是半环形图
import FunnelChart from './components/FunnelChart.vue'; // 现在是南丁格尔玫瑰图

export default {
  components: {
    CardGroup,
    LineChart,
    BarChart,
    PieChart,
    FunnelChart
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

/* 减少图表容器的默认间距 */
.el-row {
  margin-bottom: 8px;
}

/* 移除最后一个 .el-row 的底部间距 */
.el-row:last-child {
  margin-bottom: 0;
}

/* 可选：为图表添加一些基础样式 */
.chart-container {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
