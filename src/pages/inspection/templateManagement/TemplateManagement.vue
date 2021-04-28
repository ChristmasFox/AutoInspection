<template>
  <a-card>
    <!-- 1 -->
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <!-- 模板名称-->
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="模板名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <!-- 巡检指标数 -->
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="巡检指标数"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
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
        <a-button type="primary" @click="showAddTemplateModal">添加模板</a-button>
        <!-- 弹出对话框 -->
        <a-button @click="removeSelected" key="delete">批量删除</a-button>
      </a-space>
      <!-- 表格 -->
      <standard-table
        :columns="addTemColumns"
        :dataSource="addTemData"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
        @selectedRowChange="onSelectChange"
        rowKey="id"
      >
        <!-- 操作 -->
        <div slot="action" slot-scope="{}">
          <a style="margin-right: 8px" @click="showAddTemplateModal">
            编辑
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
    <!-- 添加模板对话框 -->
    <a-modal v-model="addTemplateVisible" title="添加模板" @ok="handleAddTemplateOk" width='700px'>
      <a-form-model
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        v-bind="formItemLayoutWithOutLabel"
      >
        <a-card>
          <a-row>
            <!-- 模板名称 -->
            <a-col :md="12" :sm="24" >
              <a-form-model-item label="模板名称" class="tempItem">
                <a-input v-model="dynamicValidateForm.tempName" placeholder="请输入"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-model-item label="模板描述" class="tempItem">
                <a-input v-model="dynamicValidateForm.desc" placeholder="请输入"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card>
          <a-row :style="rowStyle">
            <a-col :md="12" :sm="24" :style="colStyle">指标名称</a-col>
            <a-col :md="1" :sm="24"></a-col>
            <a-col :md="8" :sm="24" :style="colStyle">正常范围</a-col>
            <a-col :md="1" :sm="24"></a-col>
            <a-col :md="2" :sm="24" :style="colStyle">操作</a-col>
          </a-row>
          <a-row>
            <a-form-model-item 
              v-for="(domain, index) in dynamicValidateForm.domains"
              :key="domain.key"
              v-bind="index === 0 ? formItemLayout : {}"
              
              :rules="{
                required: true,
                message: 'domain can not be null',
                trigger: 'blur',
              }"
            >
              <!-- 指标 -->
              <a-select style="width: 300px; margin-right: 20px" v-model="domain.kpiName" placeholder="指标名称">
                <a-select-option v-for="item in kpiList" :key="item.id">
                  {{ item.itemName }}
                </a-select-option>
              </a-select>

              <!-- 范围 -->
              <a-input
                v-model="domain.normalRangeLeft"
                placeholder="70"
                style="width: 93px; margin-left: 8px"
              />
              -
              <a-input
                v-model="domain.normalRangeRight"
                placeholder="80"
                style="width: 93px; margin-right: 8px"
              />

              <!-- 删除按钮 -->
              <a-icon
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="dynamicValidateForm.domains.length === 1"
                @click="removeDomain(domain)"
                style="float: right; margin-right: 15px; margin-top: 3px"
              />
            </a-form-model-item>

            <!-- +新增 -->
            <a-form-model-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="dashed" style="width: 100%" @click="addDomain">
                <a-icon type="plus" /> 新增
              </a-button>
            </a-form-model-item>

            <!-- 提交/重置 -->
            <a-form-model-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="primary" html-type="submit" @click="submitForm('dynamicValidateForm')">
                提交
              </a-button>
              <a-button style="margin-left: 10px" @click="resetForm('dynamicValidateForm')">
                重置
              </a-button>
            </a-form-model-item>
          </a-row>
        </a-card>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
import StandardTable from '@/components/table/StandardTable'
const addTemColumns = [
  {
    title: '模板名称',
    dataIndex: 'tempName'
  },
  {
    title: '巡检项数',
    dataIndex: 'checkNum',
    // scopedSlots: { customRender: 'description' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '修改时间  ',
    dataIndex: 'updateTime',
  },
  {
    title: '模板描述',
    dataIndex: 'desc'
  },  
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'templateManagement',
  components: {StandardTable},
  data () {
    return {
      addTemplateVisible: false,
      addTemData: [
        {
          "id":1,
          "tempName":"主机CPU、MEM模板-v1",
          "checkNum":3,
          "createTime":"2017-04-21  08:50:08",
          "updateTime":"2017-04-21  09:50:08",
          "desc": "基础指标模板",
          "itemList":[
            { 
              "id":1001,  
              "itemName":"CPU使用率"
            },
            { 
              "id":1002,  
              "itemName":"内存使用率"
            },
            {  
              "id":1003,  
              "itemName":"磁盘使用率"
            }
          ]
        },
        {
          "id":2,
          "tempName":"主机CPU、MEM模板-v2",
          "checkNum":1,
          "createTime":"2017-04-20  08:50:08",
          "updateTime":"2017-04-20  09:50:08",
          "itemList":[
            {
              "id":1001,
              "itemName":"CPU使用率"
            }
          ]
        },
        {
          "id":3,
          "tempName":"主机CPU、MEM模板-v3",
          "checkNum":1,
          "createTime":"2017-04-20  08:50:08",
          "updateTime":"2017-04-20  09:50:08",
          "itemList":[
            {
              "id":1002,
              "itemName":"内存使用率"
            }
          ]
        }
      ],  
      rowStyle: {
        'margin-bottom': '15px',
        'background-color': 'rgba(233, 233, 233, 0.562)',
        'border-radius':'5px',
        'padding': '5px 0',
      },
      colStyle: {
        'text-align': 'center',
        'font-size': '18px',
        'font-weight': 'bloder',
        'border': '0px solid rgb(219, 219, 219)',
        'border-radius': '5px'
      },
      addTemColumns: addTemColumns,
      advanced: true,
      selectedRows: [],
      // 指标下拉
      kpiList: [
        {
          "id":1001,
          "itemName":"CPU使用率"
        },
        {
          "id":1002,
          "itemName":"内存使用率"
        },
        {
          "id":1003,
          "itemName":"磁盘使用率"
        }
      ],
      // 对话框内部表单
      formItemLayout: {
        // labelCol: {
        //   xs: { span: 4 },
        //   sm: { span: 4 },
        // },
        // wrapperCol: {
        //   xs: { span: 24 },
        //   sm: { span: 24 },
        // },
      },
      formItemLayoutWithOutLabel: {
        // wrapperCol: {
        //   xs: { span: 24, offset: 0 },
        //   sm: { span: 24, offset: 0 },
        // },
      },
      dynamicValidateForm: {
        tempName:'',
        desc: '',
        // 指标
        domains: [],
      },

    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  methods: {
    deleteRecord(id) {
      this.addTemData = this.addTemData.filter(item => item.id !== id)
      this.selectedRows = this.selectedRows.filter(item => item.id !== id)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    removeData () {
      this.addTemData = this.addTemData.filter(item => this.selectedRows.findIndex(row => row.id === item.id) === -1)
      console.log(this.addTemData)
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
      this.removeData()
    },

    // 添加模板对话框 控制
    showAddTemplateModal() {
      this.addTemplateVisible = true;
    },
    handleAddTemplateOk(e) {
      console.log(e);
      this.addTemplateVisible = false;
    },

    // 对话框内部表单函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        kpiName: '',
        normalRangeLeft: '',
        normalRangeRight: '',
        key: Date.now(),
      });
    },

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
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .tempItem {
    display: flex;
    align-items: center;
  }
</style>