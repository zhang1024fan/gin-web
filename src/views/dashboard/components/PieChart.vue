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
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: '45%',
              style: {
                text: '访问来源',
                fontSize: 20,
                fontWeight: 'bold'
              }
            }
          ]
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'], // 内圆和外圆比例
            startAngle: -90,         // 起始角度（顶部）
            endAngle: 90,           // 结束角度（底部）
            padAngle: 1,            // 分片之间的间隙角度
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside',  // 标签显示在饼图外侧
              formatter: '{b}: {d}%' // 显示名称和百分比
            },
            labelLine: {
              show: true,
              lineStyle: {
                width: 1.5
              }
            },
            data: [
              {value: 1048, name: '搜索引擎'},
              {value: 735, name: '直接访问'},
              {value: 580, name: '邮件营销'},
              {value: 484, name: '联盟广告'},
              {value: 300, name: '视频广告'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      chart.setOption(option);

      // 自适应窗口大小
      window.addEventListener('resize', () => {
        chart.resize();
      });
    }
  }
}
</script>
