<template>
  <div ref="chart" style="height: 360px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.chart);
      const option = {
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: [20, 140],
            center: ['50%', '50%'],
            roseType: 'area', // 使用南丁格尔玫瑰图
            itemStyle: {
              borderRadius: 5
            },
            data: [
              {value: 40, name: '搜索引擎'},
              {value: 38, name: '直接访问'},
              {value: 32, name: '邮件营销'},
              {value: 30, name: '联盟广告'},
              {value: 28, name: '视频广告'}
            ]
          }
        ]
      };
      chart.setOption(option);
    }
  }
}
</script>
