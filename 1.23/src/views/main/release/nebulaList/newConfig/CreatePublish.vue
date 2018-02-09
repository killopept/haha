<template>
  <el-container class="pageCreatePublish">
    <el-header  class="border">
      <div @click="goBack" class="h3">
        <i class="el-icon-arrow-left"></i>
        <span> 
          <span>版本</span>
          <span class="head-sp">{{this.fatherData.version}}</span>
        </span>
      </div>
    </el-header>
    <div class="content">
      <div class="text-header">{{this.$route.query.selected === '2' ? '修改' : '创建'}}发布任务</div>
      <div class="text-form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="发布类型" prop="resource1">
            <el-radio-group v-model="ruleForm.resource1">
              <el-radio label="1" value="1">灰度</el-radio>
              <el-radio label="2" value="2">正式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发布模型" prop="resource2" v-if="ruleForm.resource1 === '1'">
            <el-radio-group v-model="ruleForm.resource2">
              <el-radio label="1" value="1">白名单</el-radio>
              <el-radio label="2" value="2">时间窗</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="白名单配置" prop="whitelistIds" v-if="ruleForm.resource1 === '1' && ruleForm.resource2 === '1'">
            <template>
              <el-select v-model="ruleForm.whitelistIds" multiple placeholder="请选择白名单" @change="changeSelect2">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.whiteListName"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <div v-if="ruleForm.resource1 === '1' && ruleForm.resource2 === '2'">
            <el-form-item label="结束时间:" prop="date1">
                <el-date-picker 
                  class="grey-endtime"
                  type="date"
                  :picker-options="pickerBeginDateAfter"
                  placeholder="请选择时间"
                  v-model="ruleForm.date1"></el-date-picker>
              </el-form-item>
            <el-form-item label="灰度人数" prop="offlineTime">
              <el-input-number v-model="ruleForm.offlineTime" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
          </div>
          <el-form-item label="发布描述" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="高级规则" v-if="ruleForm.resource1 === '1'">
            <!-- 高级规则表格 -->
            <template>
              <el-table
                :data="pgradeTaskForm.greyConfigInfo"
                v-if="pgradeTaskForm.greyConfigInfo.length>0"
                border
                style="width: 422px;box-sizing:border-box">
                <el-table-column
                  prop="ruleElement"
                  label="规则元素"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="operation"
                  label="规则运算"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="规则值名称" width="100">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="120" prop="publishType">
                  <template slot-scope="scope">
                    <!-- 删除小对话框 -->
                    <el-popover
                      ref="popover{{$index}}"
                      placement="top"
                      width="160"
                      v-model="scope.row.confirmDelete">
                      <p>确定删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.confirmDelete = false">取消</el-button>
                        <el-button type="primary" size="mini" 
                      @click.native.prevent="deletePackageInfoIdBtn(scope.$index, scope.row)">确定</el-button>
                      </div>
                    </el-popover>
                    <el-button
                      v-popover:popover{{$index}}
                      type="text">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-button type="primary" @click="opendialog" class="outstyle">+ 添加</el-button>
          </el-form-item>
          <el-dialog title="添加高级规则" :visible.sync="qryResourceListVisible" style="text-align:left;" width="40%">
                  <el-form 
                    :model="qryResourceListForm" 
                    ref="qryResourceListForm" 
                    label-width="100px" 
                    class="demo-dynamic" 
                    :rules="qryResourceListFormRules">
                    <el-form-item label="类型:" prop="resourceType">
                      <el-select 
                        v-model="qryResourceListForm.resourceType" 
                        @change="changeSelect" 
                        size="small">
                        <el-option
                          v-for="lis in qryResourceListForm.resourceTypeList"
                          :key="lis.id"
                          :label="lis.label"
                          :value="lis.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="操作类型:">
                      <el-radio-group v-model="qryResourceListForm.operationType" size="small" @change="handleS">
                        <el-radio label="1" value="1">包含</el-radio>
                        <el-radio label="2" value="2">不包含</el-radio>
                        <el-radio label="3" value="3" 
                          v-if="qryResourceListForm.resourceType==='productVersion'||qryResourceListForm.resourceType==='osVersion'">范围内</el-radio>
                        <el-radio label="4" value="4"
                          v-if="qryResourceListForm.resourceType==='productVersion'||qryResourceListForm.resourceType==='osVersion'">范围外</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="资源值:" prop="resourceValues"
                      v-if="qryResourceListForm.operationType==='1'||qryResourceListForm.operationType==='2'">
                      <el-select 
                        v-model="qryResourceListForm.resourceValues" 
                        multiple 
                        placeholder="请选择" size="small">
                        <el-option
                          v-for="item in resourceList"
                          :key="item.id"
                          :label="item.resourceName"
                          :value="item.resourceName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="资源值上值:" prop="resourceTopValue"
                      v-if="qryResourceListForm.operationType==='3'||qryResourceListForm.operationType==='4'">
                      <el-select 
                        v-model="qryResourceListForm.resourceTopValue" 
                        size="small">
                        <el-option
                          v-for="lis in resourceList"
                          :key="lis.id"
                          :label="lis.resourceName"
                          :value="lis.resourceName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="资源值下值:" prop="resourceUnderValue"
                      v-if="qryResourceListForm.operationType==='3'||qryResourceListForm.operationType==='4'">
                      <el-select 
                        v-model="qryResourceListForm.resourceUnderValue" 
                        size="small">
                        <el-option
                          v-for="lis in resourceList"
                          :key="lis.id"
                          :label="lis.resourceName"
                          :value="lis.resourceName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="qryResourceListVisible = false" size="small">取消</el-button>
                    <el-button type="primary" @click="addUpgradeFormSubmit('qryResourceListForm')" size="small">确认</el-button>
                  </div>
                </el-dialog>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-container>
</template>

<script>
import {qryWhiteList, qryResourceList, createZipMappingTask, getUpgradeTaskDetail} from '~/config/api'
export default {
  data () {
    return {
      pgradeTaskForm: {
        publishType: '1',
        upgradeType: '0',
        upgradeType1: '0',
        upgradeType2: '1',
        publishMode: '1',
        whitelistIds: [],
        upgradeContent: '欢迎使用新版本',
        memo: '新版本发布',
        greyConfigInfo: [],
        greyNum: '999',
        realGreyEndtime: '',
        realGreyEndtype: '',
        id: ''
      },
      qryResourceListVisible: false, // 模态框是否显示
      // 发布表单
      ruleForm: {
        date1: '',
        resource1: '1',
        resource2: '1',
        offlineTime: 999,
        desc: '',
        whitelistIds: []
      },
      qryResourceListForm: {
        resourceType: 'productVersion',
        resourceTypeList: [
          {
            id: 0,
            label: '版本号',
            value: 'productVersion'
          },
          {
            id: 1,
            label: '城市',
            value: 'city'
          },
          {
            id: 2,
            label: '机型',
            value: 'mobileModel'
          },
          {
            id: 3,
            label: '网络',
            value: 'netType'
          },
          {
            id: 4,
            label: 'osVersion',
            value: 'osVersion'
          }
        ],
        operationType: '1',
        resourceValues: [],
        resourceUnderValue: '',
        resourceTopValue: ''
      },
      resourceList: [],
      whiteList: [],
      qryResourceListFormRules: {
        publishType: [
          { required: true, message: '发布类型不能为空', trigger: 'blur' }
        ],
        resourceType: [
          { required: true, message: '资源类型不能为空', trigger: 'blur' }
        ],
        resourceValues: [
          { required: true, message: '资源值不能为空', trigger: 'blur' }
        ],
        resourceUnderValue: [
          { required: true, message: '资源下值不能为空', trigger: 'blur' }
        ],
        resourceTopValue: [
          { required: true, message: '资源上值不能为空', trigger: 'blur' }
        ]
      },
      fatherData: {
        selected: '',
        platform: '',
        menu: '',
        version: '',
        isEnterprise: '',
        id: '',
        packageInfoId: ''
      },
      pickerBeginDateAfter: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      options: [],
      rules: {
        date1: [
          { required: false, message: '请选择日期', trigger: 'change' }
        ],
        resource1: [
          { required: false, message: '请选择发布类型', trigger: 'change' }
        ],
        resource2: [
          { required: false, message: '请选择发布模型', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写发布描述', trigger: 'blur' }
        ],
        offlineTime: [
          { required: false, message: '该项为必填项', trigger: 'blur' }
        ]
      },
      value1: '',
      restaurants: []
    }
  },
  methods: {
    Notification (title = '成功', message = '这是一条成功的提示消息', type = 'success', duration = 2000) {
      this.$notify({
        title: title,
        message: message,
        type: type,
        duration: duration
      })
    },
    goBack () {
      history.go(-1)
    },
    // 白名单配置改变输出值
    changeSelect2 (value) {
      this.ruleForm.whitelistIds = value
    },
    // 获取白名单列表
    getQryWhiteListFunc () {
      qryWhiteList().then(res => {
        this.options = res.data.body.whiteList
      })
    },
    // 确定发布按钮提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.resource2 === '2') {
            if (this.$route.query.selected === '2') {
              this.ruleForm.date1 = this.ruleForm.date1.split('-').join('') + '000000'
            } else {
              var year = this.ruleForm.date1.getFullYear()
              var month = this.ruleForm.date1.getMonth() + 1
              month = month > 10 ? month : '0' + month
              var day = this.ruleForm.date1.getDate()
              day = day > 10 ? day : '0' + day
              this.ruleForm.date1 = year + '' + month + '' + day + '000000'
            }
          }
          if (this.pgradeTaskForm.greyConfigInfo.length > 0) {
            this.pgradeTaskForm.greyConfigInfo.forEach(res => {
              res.operation = res.operation === '包含' ? '1' : res.operation === '不包含' ? '2' : res.operation === '范围内' ? '3' : res.operation === '范围外' ? '4' : res.operation
            })
          }
          var data8 = {
            serviceMappingId: sessionStorage.getItem('serviceMappingId'),
            publishType: this.ruleForm.resource1,
            publishMode: this.ruleForm.resource2,
            whitelistIds: this.ruleForm.whitelistIds.join(','),
            realGreyEndtime: this.ruleForm.date1,
            greyNum: this.ruleForm.offlineTime,
            memo: this.ruleForm.desc,
            greyConfigInfo: JSON.stringify(this.pgradeTaskForm.greyConfigInfo)
          }
          createZipMappingTask(data8).then(res => {
            if (res.data.body.errorCode === '0') {
              if (this.fatherData.selected === '1') {
                this.Notification('成功', '添加发布成功！')
              } else {
                this.Notification('成功', '发布修改成功！')
              }
              this.goBack()
            } else {
              this.Notification('失败', '操作失败', 'error')
            }
            // console.log(res)
          })
        }
      })
    },
    // 代开模态框
    opendialog () {
      this.qryResourceListVisible = true
    },
    // // 资源值方法调用开始
    // querySearch (queryString, cb) {
    //   var restaurants = this.restaurants
    //   var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    // createFilter (queryString) {
    //   return (restaurant) => {
    //     return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // 高级规则部分
    // 获取资源列表
    getTaskResourceFunc (tpe) {
      var tskItem = {
        platform: '0',
        resourceType: tpe
      }
      qryResourceList(tskItem).then(res => {
        this.resourceList = res.data.body.resourceList
      })
    },
    // 资源类型切换
    changeSelect (item) {
      if (item === 'productVersion') {
        this.getTaskResourceFunc('version')
      } else {
        this.getTaskResourceFunc(item)
      }
      this.qryResourceListForm.operationType = '1'
      this.qryResourceListForm.resourceValues = []
    },
    // 确认高级规则添加
    addUpgradeFormSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 增加高级规则数据
          var qryResourceLi = {
            ruleElement: this.qryResourceListForm.resourceType,
            operation: this.qryResourceListForm.operationType,
            confirmDelete: false
          }
          // 如果是版本号或osVersion类型
          if (this.qryResourceListForm.resourceType === 'productVersion' || this.qryResourceListForm.resourceType === 'osVersion') {
            if (this.qryResourceListForm.operationType === '1' || this.qryResourceListForm.operationType === '2') {
              qryResourceLi.value = this.qryResourceListForm.resourceValues.join(',')
            } else {
              qryResourceLi.value1 = this.qryResourceListForm.resourceTopValue
              qryResourceLi.value2 = this.qryResourceListForm.resourceUnderValue
              qryResourceLi.value = qryResourceLi.value1 + '-' + qryResourceLi.value2
            }
          } else {
            qryResourceLi.value = this.qryResourceListForm.resourceValues.join(',')
          }
          // 高级规则添加到列表
          var key = ''
          this.pgradeTaskForm.greyConfigInfo.forEach(item => {
            if (qryResourceLi.ruleElement === item.ruleElement) {
              key = 1
            }
          })
          if (key === 1) {
            // this.Notification('失败', '这是一条成功的提示消息', 'error')
            this.$alert('<strong>不能添加相同的高级规则！</strong>', '提示', {
              dangerouslyUseHTMLString: true
            })
          } else {
            this.pgradeTaskForm.greyConfigInfo.push(qryResourceLi)
          }
          this.qryResourceListVisible = false
          this.qryResourceListForm.operationType = '1'
          this.qryResourceListForm.resourceValues = []
          this.qryResourceListForm.resourceUnderValue = ''
          this.qryResourceListForm.resourceTopValue = ''
        } else {
          return false
        }
      })
    },
    // 删除高级规则当前行数据
    deletePackageInfoIdBtn (index, rows) {
      this.pgradeTaskForm.greyConfigInfo.splice(index, 1)
    },
    // 切换操作类型清除数据
    handleS (val) {
      this.qryResourceListForm.resourceValues = []
      this.qryResourceListForm.resourceUnderValue = ''
      this.qryResourceListForm.resourceTopValue = ''
    }
  },
  // 修改发布数据挂载
  beforeMount () {
    this.fatherData.selected = this.$route.query.selected
    this.fatherData.version = this.$route.query.productVersion
    this.getQryWhiteListFunc()
    this.getTaskResourceFunc('version')
    if (this.fatherData.selected === '1') {
    } else {
      var sendItem = {
        taskId: this.$route.query.id
      }
      getUpgradeTaskDetail(sendItem).then(res => {
        // console.log(res)
        var upgradeTaskDetail = res.data.body
        this.ruleForm.resource1 = upgradeTaskDetail.publishType
        this.ruleForm.resource2 = upgradeTaskDetail.publishMode
        // 时间窗结束时间
        if (upgradeTaskDetail.realGreyEndtime) {
          this.ruleForm.date1 = upgradeTaskDetail.realGreyEndtime.slice(0, 4) + '-' + upgradeTaskDetail.realGreyEndtime.slice(4, 6) + '-' + upgradeTaskDetail.realGreyEndtime.slice(6, 8)
        } else {
          this.ruleForm.date1 = upgradeTaskDetail.realGreyEndtime
        }
        upgradeTaskDetail.whitelistIds.forEach(res => {
          this.ruleForm.whitelistIds.push(res.id)
        })
        this.ruleForm.offlineTime = upgradeTaskDetail.greyNum
        this.ruleForm.desc = upgradeTaskDetail.memo
        JSON.parse(upgradeTaskDetail.greyConfigInfo).subRules.forEach(res => {
          // console.log(res)
          if (res.operator === '3' || res.operator === '4') {
            this.pgradeTaskForm.greyConfigInfo.push({
              ruleElement: res.right,
              operation: res.operator === '1' ? '包含' : res.operator === '2' ? '不包含' : res.operator === '3' ? '范围内' : '范围外',
              value: res.left.lower + '-' + res.left.upper,
              value1: res.left.lower,
              value2: res.left.upper
            })
          } else {
            this.pgradeTaskForm.greyConfigInfo.push({
              ruleElement: res.right,
              operation: res.operator === '1' ? '包含' : res.operator === '2' ? '不包含' : res.operator === '3' ? '范围内' : '范围外',
              value: res.left.join(',')
            })
          }
        })
      })
    }
  }
}
</script>

