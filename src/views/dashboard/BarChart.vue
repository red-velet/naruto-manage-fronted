<template>
  <div id="mychart" :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import * as echarts from 'echarts';
import { getPowerChart } from "@/api/naruto/member";

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
  },
  data() {
    return {
      myChart: null,
      chartOption: {
        xAxis: [{
          type: 'category',
          data: [],
        }],
        yAxis: {},
        series: [
          {
            name: '人数',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [],
            animationDuration: 600,
            label: {
              show: true,
              fontStyle: "italic"
            },
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      this.handlePowerChart();
    });
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
  },
  methods: {
    initChart() {
      this.myChart = echarts.init(document.getElementById('mychart'));
      this.myChart.setOption(this.chartOption);
    },
    handlePowerChart() {
      getPowerChart().then(response => {
        this.updateChart(response.counts, response.betweens);
      });
    },
    updateChart(counts, betweens) {
      this.chartOption.series[0].data = counts;
      this.chartOption.xAxis[0].data = betweens;
      this.myChart.setOption(this.chartOption);
    },
  }
};
</script>

<style scoped>
/* 样式调整 */
</style>
