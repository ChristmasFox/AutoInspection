<template>
  <div class="home">
    <!-- chart-card -->
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="巡检计划总数" :total="dataList.planNum">
          <!-- 提示气泡框 -->
          <a-tooltip title="巡检计划总数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <a-icon type="hdd" theme="twoTone" slot="iconItem"/>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="主机总数" :total="dataList.hostNum">
          <!-- 提示气泡框 -->
          <a-tooltip title="主机总数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <a-icon type="gold" theme="twoTone" slot="iconItem"/>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="成功总数" :total="dataList.successNum">
          <!-- 提示气泡框 -->
          <a-tooltip title="成功总数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
      <a-icon type="schedule" theme="twoTone" slot="iconItem" twoToneColor="#00cc00"/>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="失败总数" :total="dataList.failedNum">
          <!-- 提示气泡框 -->
          <a-tooltip title="失败总数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <a-icon type="warning" theme="twoTone" slot="iconItem" twoToneColor="#ff0000"/>
        </chart-card>
      </a-col>
    </a-row>

    <!-- 任务结果柱状图 -->
    <a-card :loading="loading" style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
      <div class="resultCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrap" slot="tabBarExtraContent">
            <a-range-picker :style="{width: '256px'}"></a-range-picker>
          </div>
          <a-tab-pane loading="true" tab='' key="1">
              <div id="resultBar" style="width: auto;height: 400px"></div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <!-- 成功率折线图 -->
    <a-card :loading="loading" style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
      <div class="resultCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrap" slot="tabBarExtraContent">
            <a-range-picker :style="{width: '256px'}"></a-range-picker>
          </div>
          <a-tab-pane loading="true" tab='' key="1">
             <div id="successRateBar" style="width: auto;height: 400px"></div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>

</template>
<script>
import ChartCard from '../../../components/card/ChartCard'
function getkeysValue(objectData) {
  var values = []
  for(var key in objectData) {
    values.push(objectData[key])
  }
  return values
}
function formatSuccRateData(succRateData) {
  var keys = []
  var values = []
  succRateData.forEach(item => {
    keys.push(Object.keys(item)[0])
    values.push(item[Object.keys(item)[0]])
  });
  return {
    keys,
    values
  }
}
export default {
  name: 'Home',
  components: {ChartCard }, 
  data() {
    return {
      dataList: {
        "planNum": 100,
        "hostNum": 20,
        "successNum": 182,
        "failedNum": 18,
        "resultChartData": {
          "success": [
            {
              "2021-4-10": 120,
              "2021-4-11": 200,
              "2021-4-12": 150,
              "2021-4-13": 80,
              "2021-4-14": 100,
              "2021-4-15": 130
            }
          ],
          "failed": [
            {
              "2021-4-10": 10,
              "2021-4-11": 5,
              "2021-4-12": 12,
              "2021-4-13": 12,
              "2021-4-14": 4,
              "2021-4-15": 6
            }
          ]
        },
        "successRateData": [
          {
            "2021-4-10": 80
          },
          {
            "2021-4-11": 100
          },
          {
            "2021-4-12": 90
          },
          {
            "2021-4-13": 80
          },
          {
            "2021-4-14": 100
          },
          {
            "2021-4-15": 99
          }
        ]
      },
      loading: false,
    }
  },
  create() {
    setTimeout(() => this.loading = !this.loading, 1000);
  },
  mounted() {
    this.echartsInit()
    formatSuccRateData(this.dataList.successRateData)
  },
  methods: {
    echartsInit() {
      // 任务结果柱状图
      this.$echarts.init(document.getElementById('resultBar')).setOption({
        title: {
            text: '任务结果柱状图',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['成功', '失败']
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '3%',
            containLabel: true,
            width: '80%'
        },
        yAxis: {
            type: 'value',
        },
        xAxis: {
            type: 'category',
            data: Object.keys(this.dataList.resultChartData.success[0])
        },
        series: [
          {
            name: '成功',
            type: 'bar',
            data: getkeysValue(this.dataList.resultChartData.success[0])
          },
          {
            name: '失败',
            type: 'bar',
            data: getkeysValue(this.dataList.resultChartData.failed[0])
          }
        ]
      }),
      
      // 成功率趋势折线图
      this.$echarts.init(document.getElementById('successRateBar')).setOption({
        title: {
            text: '成功率趋势图',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '3%',
            containLabel: true,
            width: '80%'
        },
        yAxis: {
            type: 'value',
        },
        xAxis: {
            type: 'category',
            data: formatSuccRateData(this.dataList.successRateData).keys
        },
        series: [
          {
            name: '成功',
            type: 'line',
            data: formatSuccRateData(this.dataList.successRateData).values
          },
        ]
      })
    },
  },
}
</script>
<style lang="less" scoped>
  .extra-wrap{
    .extra-item{
      display: inline-block;
      margin-right: 24px;
      a:not(:first-child){
        margin-left: 24px;
      }
    }
  }
  @media screen and (max-width: 992px){
    .extra-wrap .extra-item{
      display: none;
    }
  }
  @media screen and (max-width: 576px){
    .extra-wrap{
      display: none;
    }
  }
</style>