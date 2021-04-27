<template>
  <a-card>
    <!-- 1 -->
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <!-- 资源名称 -->
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="资源名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <!-- IP地址 -->
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="IP地址"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="巡检指标"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 表单查询重置按钮 -->
        <div style="width: 200px; margin: 0 auto;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </div>
      </a-form>
    </div>

    <!-- 2 -->
    <div>
      <a-space class="operator">
        <a-button @click="removeSelected" key="delete">批量删除</a-button>
      </a-space>
      <!-- 表格 -->
      <standard-table
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
        @selectedRowChange="onSelectChange"
        rowKey="itemName"
      >
        <div slot="itemState" slot-scope="{text}">
          <span style="color: #00cc00" v-if="text === '正常'">{{text}}</span>
          <span style="color: #ff0000" v-else>{{text}}</span>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>

  </a-card>
</template>
<script>
import StandardTable from '@/components/table/StandardTable'
const columns = [
  {
    title: '资源名称',
    dataIndex: 'resName'
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    // scopedSlots: { customRender: 'description' }
  },
  {
    title: '指标名称',
    dataIndex: 'itemName',
  },
  {
    title: '指标巡检结果',
    dataIndex: 'checkResult',
  },
  {
    title: '正常范围',
    dataIndex: 'normalRange'
  },
  {
    title: '指标状态',
    dataIndex: 'itemState',
    scopedSlots: { customRender: 'itemState' }
  }
]

export default {
  name: 'executedetail',
  components: {StandardTable},
  data () {
    return {
      dataSource: [{"resName":"linux_192.168.52.188","ip":"192.168.52.188","itemName":"CPU使用率","checkResult":"89.87%","normalRange":"80~90","itemState":"正常"},{"resName":"linux_192.168.52.187","ip":"192.168.52.187","itemName":"内存使用率","checkResult":"78.83%","normalRange":"60~70","itemState":"异常"},{"resName":"linux_192.168.52.186","ip":"192.168.52.186","itemName":"fc端口状态","checkResult":"0","normalRange":"1","itemState":"异常"}],
      advanced: true,
      columns: columns,
      selectedRows: []
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  methods: {
    deleteRecord(ip) {
      this.dataSource = this.dataSource.filter(item => item.ip !== ip)
      this.selectedRows = this.selectedRows.filter(item => item.ip !== ip)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.ip === item.ip) === -1)
      console.log(this.dataSource)
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      this.$message.info('表格状态改变了')
    },
    onSelectChange() {
      console.log(this.selectedRows)
      this.$message.info('选中行改变了')
    },
    removeSelected () {
      this.remove()
    },

    // 添加计划对话框 控制
    // showAddPlanModal() {
    //   this.addPlanVisible = true;
    // },
    // handleAddPlanOk(e) {
    //   console.log(e);
    //   this.addPlanVisible = false;
    // },
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>