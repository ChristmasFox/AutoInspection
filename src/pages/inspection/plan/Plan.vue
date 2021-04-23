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
                <a-select placeholder="请选择">
                  <a-select-option value="0">手动</a-select-option>
                  <a-select-option value="1">自动</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="创建时间"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-date-picker style="width: 100%" placeholder="请输入创建时间" />
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
        <a-button type="primary" @click="showAddPlanModal">添加计划</a-button>
        <!-- 弹出对话框 -->
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
        <div slot="action" slot-scope="{}">
          <a style="margin-right: 8px">
            启动
          </a>
          <a style="margin-right: 8px">
            停止
          </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>

    <!-- 隐藏的对话框 -->
    <!-- 添加计划对话框 -->
    <a-modal v-model="addPlanVisible" title="添加计划" @ok="handleAddPlanOk" width='1000px'>
      <a-form-model :model="addPlanForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-card>
            <a-row >
              <!-- 计划名称 -->
              <a-col :md="12" :sm="24" >
                <a-form-model-item label="计划名称">
                  <a-input v-model="addPlanForm.planName" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-model-item label="巡检类型">
                  <a-select v-model="addPlanForm.checkType" placeholder="请选择">
                    <a-select-option value="0">
                      手动
                    </a-select-option>
                    <a-select-option value="1">
                      自动
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row >
              <!-- 计划名称 -->
              <a-col :md="12" :sm="24" >
                <a-form-model-item label="cron表达式">
                  <a-input v-model="addPlanForm.cron" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-model-item label="选择模板">
                  <a-select v-model="addPlanForm.tempName" placeholder="请选择">
                    <a-select-option v-for="item in modelList" :key="item.id" :value="item.name">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card title="选择主机">
            <a-transfer
              :data-source="mockData"
              :titles="['资源名称+IP地址', '资源名称+IP地址']"
              :target-keys="targetKeys"
              :selected-keys="selectedKeys"
              :render="item => item.title"
              :disabled="disabled"
              @change="handleChange"
              @selectChange="handleSelectChange"
              @scroll="handleScroll"
            />
            <a-switch
              un-checked-children="enabled"
              checked-children="disabled"
              :checked="disabled"
              style="margin-top: 16px"
              @change="handleDisable"
            />    
          </a-card>
          
      </a-form-model>
    </a-modal>
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
    title: '巡检类型',
    dataIndex: 'checkType',
    // scopedSlots: { customRender: 'description' }
  },
  {
    title: '使用模板',
    dataIndex: 'tempUsed',
  },
  {
    title: 'cron表达式',
    dataIndex: 'cron',
  },
  {
    title: '巡检状态',
    dataIndex: 'checkState'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'Plan',
  components: {StandardTable},
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      addPlanForm: {
        planName: '',
        checkType: '',
        cron: '',
        tempName: '',
      },
      // 穿梭框
      mockData: [],
      targetKeys: [],
      selectedKeys: [],
      disabled: false,
      addPlanVisible: false,
      // 假数据
      modelList: [{"id":1,"name":"主机CPU、MEM模板-v202104141538"},{"id":2,"name":"主机CPU、MEM模板-v202104141539"},{"id":3,"name":"主机CPU、MEM模板-v202104141540"}],
      hostList: [{"id":1,"name":"linux_192.168.52.188","ip":"192.168.52.188"},{"id":2,"name":"linux_192.168.52.187","ip":"192.168.52.187"},{"id":3,"name":"linux_192.168.52.186","ip":"192.168.52.186"},{"id":4,"name":"linux_192.168.52.185","ip":"192.168.52.185"}],
      dataSource: [
        {
          "planName":"服务器维护周期巡检-202104132150",
          "checkType":"自动","cron":"0 */1 * * * ?",
          "tempUsed":"基础巡检-v001",
          "checkState":"运行中","createTime":"2017-04-21  08:50:08"
        },
        {
          "planName":"服务器维护周期巡检-202104132149",
          "checkType":"手动",
          "cron":"-",
          "checkState":"关闭",
          "createTime":"2017-04-20  08:50:08"
        },
        {
          "planName":"服务器维护周期巡检-202104132148",
          "checkType":"手动",
          "cron":"-",
          "checkState":"关闭",
          "createTime":"2017-04-19  08:50:08"
        },
        {
          "planName":"服务器维护周期巡检-202104132147",
          "checkType":"自动",
          "cron":"0 */1 * * * ?",
          "checkState":"关闭",
          "createTime":"2017-04-18  08:50:08"
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
  created() {
    // 把 hostList 的键 id 和 name 替换成 key 和 title 并将 key 的键值转成字符串 方便使用 Ant Design of Vue
    this.letIdToKey(this.hostList)
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

    // 添加计划对话框 控制
    showAddPlanModal() {
      this.addPlanVisible = true;
    },
    handleAddPlanOk(e) {
      console.log(e);
      this.addPlanVisible = false;
    },

    // 穿梭框 选择的数据键值绑定在 targetSelectedKeys
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys;
      console.log('targetKeys: ', nextTargetKeys);
      console.log('direction: ', direction);
      console.log('moveKeys: ', moveKeys);
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];

      console.log('sourceSelectedKeys: ', sourceSelectedKeys);
      console.log('targetSelectedKeys: ', targetSelectedKeys);
    },
    handleScroll(direction, e) {
      console.log('direction:', direction);
      console.log('target:', e.target);
    },
    handleDisable(disabled) {
      this.disabled = disabled;
    },

    // 把 hostList 的键 id 和 name 替换成 key 和 title 并将 key 的键值转成字符串 方便使用 Ant Design of Vue
    letIdToKey(data) {
      data = JSON.parse(JSON.stringify(data).replace(/id/g, 'key'))
      this.mockData = JSON.parse(JSON.stringify(data).replace(/name/g, 'title'))
      this.mockData.forEach(item => {
        item.key += ""  
      });
    },

    // 表单提交
    onSubmit() {
      console.log('submit!', this.form);
    },
  }
}
</script>

<style lang="less">
  .ant-transfer {
    width: 100%;
    margin: 0 auto;
  }
  .ant-transfer-list {
    width: 400px;
  }
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