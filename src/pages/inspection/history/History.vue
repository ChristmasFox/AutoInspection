<template>
  <a-card>
    <!-- 1 -->
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <!-- 计划名称 -->
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="计划名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <!-- 巡检类型 -->
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="巡检类型"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="全部">
                  <a-select-option value="0">手动</a-select-option>
                  <a-select-option value="1">自动</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="执行状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="全部">
                  <a-select-option value="0">关闭</a-select-option>
                  <a-select-option value="1">执行中</a-select-option>
                </a-select>
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
        rowKey="planName"
      >
        <!-- 操作 -->
        <div slot="action" slot-scope="{ record }">
          <a style="margin-right: 8px" @click="handleToExecutedetail(record)">
            执行详情
          </a>
          <a style="margin-right: 8px" @click="handleToReportdetail(record)">
            报告
          </a>
          <a style="margin-right: 8px">
            删除
          </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>

    <!-- 隐藏的对话框 -->
    <!-- <a-modal v-model="addPlanVisible" title="添加计划" @ok="handleAddPlanOk">s
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal> -->
  </a-card>
</template>
<script>
import StandardTable from '@/components/table/StandardTable'
const columns = [
  {
    title: '计划名称',
    dataIndex: 'planName'
  },
  {
    title: '模板',
    dataIndex: 'tempName',
    // scopedSlots: { customRender: 'description' }
  },
  {
    title: '异常项数',
    dataIndex: 'failedNum',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'history',
  components: {StandardTable},
  data () {
    return {
      dataSource: [
        {
          "planName":"服务器维护周期巡检-1",
          "tempName":"基础巡检模板-v1",
          "failedNum":3,
          "startTime":"2017-04-21 08:48:08",
          "endTime":"2017-04-21 08:50:08"
        },
        {
          "planName":"服务器维护周期巡检-2",
          "tempName":"基础巡检模板-v1",
          "failedNum":2,
          "startTime":"2017-04-20 08:48:08",
          "endTime":"2017-04-20 08:50:08"
        },
        {
          "planName":"服务器维护周期巡检-3",
          "tempName":"基础巡检模板-v2",
          "failedNum":1,
          "startTime":"2017-04-19 08:48:08",
          "endTime":"2017-04-19 08:50:08"
        }
      ],
      advanced: true,
      columns: columns,
      selectedRows: []
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  methods: {
    deleteRecord(planName) {
      this.dataSource = this.dataSource.filter(item => item.planName !== planName)
      this.selectedRows = this.selectedRows.filter(item => item.planName !== planName)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.planName === item.planName) === -1)
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
    handleToExecutedetail(record) {
      console.log(record)
      this.$router.push(`/detail/executedetail/${record.planName}`)
    },
    handleToReportdetail(record) {
      console.log(record)
      this.$router.push(`/detail/reportdetail/${record.planName}`)
    }
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