<template>
  <div class="reportDetail">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-card style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
        <h1 style="font-weight: bolder; text-align: center; font-size: 22px">巡检报告</h1>
        <p>2021年04月14日</p>
      </a-card>
    </a-row>

    <!-- 总览 -->
    <a-row style="margin-top: 20px" :gutter="[24, 24]">
      <a-card title="总览">
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card style="border: 1px solid rgb(220, 220, 220);" :loading="loading" title="巡检资源数" :total="totalData.resNum">
            <!-- 提示气泡框 -->
            <a-tooltip title="巡检资源数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <a-icon type="gold" theme="twoTone" slot="iconItem" style="font-size: 50px" />
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card style="border: 1px solid rgb(220, 220, 220);" :loading="loading" title="巡检指标数" :total="totalData.itemNum">
            <!-- 提示气泡框 -->
            <a-tooltip title="巡检指标数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <a-icon type="hdd" theme="twoTone" slot="iconItem" style="font-size: 50px" />
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card style="border: 1px solid rgb(220, 220, 220);" :loading="loading" title="巡检异常数" :total="totalData.failedNum">
            <!-- 提示气泡框 -->
            <a-tooltip title="巡检异常数" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <a-icon type="warning" theme="twoTone" slot="iconItem" style="font-size: 50px" twoToneColor="#ff0000"/>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6">
          <chart-card style="border: 1px solid rgb(220, 220, 220);" :loading="loading" title="巡检正常率" :total="totalData.normalRate">
            <!-- 提示气泡框 -->
            <a-tooltip title="巡检正常率" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <!-- <a-icon type="safety-certificate" theme="twoTone" slot="iconItem" twoToneColor="#00cc00" /> -->
            <a-progress type="circle" :percent="totalData.normalRate.replace(/%/g, '')" 
            :width="50" slot="iconItem" :showInfo="false" strokeWidth="15" />
          </chart-card>
        </a-col>
      </a-card>
    </a-row>

    <!-- 详情 -->
    <a-row style="margin-top: 20px;margin-bottom: 20px;" :gutter="[24, 24]">
      <a-card title="详情">
        <table class="sourcTable" border="1" width="100%">
          
          <tr><td>资源名称</td><td>IP地址</td><td>CPU使用率</td><td>端口状态</td><td>内存使用率</td></tr>
          <tr v-for="item in tableData" :key="item.resName">
            <td>{{ item.resName }}</td>
            <td>{{ item.ip }}</td>
            <td>
              <table class="smallTable" border="1" width="100%">
                <tr>
                  <td>巡检结果</td>
                  <td>正常范围</td>
                  <td class="lastCol">指标状态</td>
                </tr>
                <tr class="lastrow">
                  <td>{{item.itemList[0].resultList[0].checkResult}}</td>
                  <td>{{item.itemList[0].resultList[0].normalRange}}</td>
                  <td :class="item.itemList[0].resultList[0].itemState === '正常' ? 'lastCol normal' : 'lastCol error'">{{item.itemList[0].resultList[0].itemState}}</td>
                </tr>
              </table>
            </td>
            <td>
              <table class="smallTable" border="1" width="100%">
                <tr>
                  <td>巡检结果</td>
                  <td>正常范围</td>
                  <td class="lastCol">指标状态</td>
                </tr>
                <tr class="lastrow">
                  <td>{{item.itemList[1].resultList[0].checkResult}}</td>
                  <td>{{item.itemList[1].resultList[0].normalRange}}</td>
                  <td :class="item.itemList[1].resultList[0].itemState === '正常' ? 'lastCol normal' : 'lastCol error'">{{item.itemList[1].resultList[0].itemState}}</td>
                </tr>
              </table>
            </td>
            <td>
              <table class="smallTable" border="1" width="100%">
                <tr>
                  <td>巡检结果</td>
                  <td>正常范围</td>
                  <td class="lastCol">指标状态</td>
                </tr>
                <tr class="lastrow">
                  <td>{{item.itemList[2].resultList[0].checkResult}}</td>
                  <td>{{item.itemList[2].resultList[0].normalRange}}</td>
                  <td :class="item.itemList[2].resultList[0].itemState === '正常' ? 'lastCol normal' : 'lastCol error'">{{item.itemList[2].resultList[0].itemState}}</td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </a-card>
    </a-row>

    <!-- 导出 -->
    <a-button type="primary">
      导出
    </a-button>
  </div>
</template>
<script>
import ChartCard from '@/components/card/ChartCard'
export default {
  name: 'reportdetail',
  components: { ChartCard },
  data() {
    return {
      loading: false,
      totalData: {"resNum":200,"itemNum":43,"failedNum":2,"normalRate":"89.87%"},
      tableData: [{"resName":"linux_192.168.52.188","ip":"192.168.52.188","itemList":[{"itemName":"CPU使用率","resultList":[{"checkResult":"68.34%","normalRange":"80~90","itemState":"正常"}]},{"itemName":"内存使用率","resultList":[{"checkResult":"87.56%","normalRange":"70~80","itemState":"异常"}]},{"itemName":"fc端口状态","resultList":[{"checkResult":"0","normalRange":"1","itemState":"异常"}]}]},{"resName":"linux_192.168.52.187","ip":"192.168.52.187","itemList":[{"itemName":"CPU使用率","resultList":[{"checkResult":"98.78%","normalRange":"80~90","itemState":"异常"}]},{"itemName":"内存使用率","resultList":[{"checkResult":"45.34%","normalRange":"70~80","itemState":"正常"}]},{"itemName":"fc端口状态","resultList":[{"checkResult":"1","normalRange":"1","itemState":"正常"}]}]}]
    }
  },
  create() {
    setTimeout(() => this.loading = !this.loading, 1000);
  },
}
</script>
<style lang="less">
  .ant-card-head {
    font-weight: 600;
  }
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
  .sourcTable {
    text-align: center;
  }
  .smallTable {
    text-align: center;
    border-collapse: collapse;
		border: 0px solid #999;
  }
  .smallTable td {
		border-top: 0;
		border-right: 1px solid #999;
		border-bottom: 1px solid #999;
		border-left: 0;
	}
	
	.smallTable tr.lastrow td {
		border-bottom: 0;
	}
	
	.smallTable tr td.lastCol {
		border-right: 0;
	}

  .ant-progress-circle-wrap,
  .ant-progress-line-wrap {
    margin-right: 8px;
    margin-bottom: 5px;
  }

  .normal {
    color: blue;
  }
  .error {
    color: #ff0000;
  }
</style>