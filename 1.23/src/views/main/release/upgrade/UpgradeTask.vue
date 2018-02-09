<template>
  <!-- 创建发布包和修改发布包管理页面 -->
  <div class="page-pgradeTask">
    <el-container  class="page-table">
      <el-header  class="border">
        <router-link to="/main/upgradeManage">
          <i class="el-icon-arrow-left"></i>
          <span> 
            <span>{{fatherData.version}}</span>
            <span class="head-sp">
              {{fatherData.platform==='1'?'Android':fatherData.platform==='2'?'IOS':fatherData.platform}}
            </span>
          </span>
        </router-link>
      </el-header>
      <el-main class="border main">
        <h3>{{fatherData.pageMenu}}</h3>
        <div class="taskContent">
          <el-form  label-position="right" 
                    size="small" 
                    label-width="150px" 
                    :model="pgradeTaskForm" 
                    :rules="pgradeTaskFormRules" 
                    ref="pgradeTaskForm">
            <el-form-item label="发布类型:" prop="publishType">
              <el-radio-group v-model="pgradeTaskForm.publishType" size="small">
                <el-radio label="1" value="1">灰度</el-radio>
                <el-radio label="2" value="2" :disabled="fatherData.isEnterprise === '企业包'">正式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="升级模式:" prop="upgradeType">
              <el-radio-group v-model="pgradeTaskForm.upgradeType1" size="small" @change="upgradeTypeChangeFunc1">
                <el-radio label="0" value="0">忽略更新</el-radio>
                <el-radio label="1" value="1">提示更新</el-radio>
                <el-radio label="3" value="3">强制更新</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="提示模式:" prop="upgradeType"
              v-if="pgradeTaskForm.upgradeType1==='1'">
              <el-radio-group v-model="pgradeTaskForm.upgradeType2" size="small" @change="upgradeTypeChangeFunc2">
                <el-radio label="1" value="1">单次</el-radio>
                <el-radio label="2" value="2">多次</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布模式:" prop="publishMode"
              v-if="pgradeTaskForm.publishType==='1'">
              <el-radio-group v-model="pgradeTaskForm.publishMode" size="small" @change="changePublishType">
                <el-radio label="1" value="1">白名单</el-radio>
                <el-radio label="2" value="2" :disabled="fatherData.isEnterprise === '企业包'">时间窗</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="白名单配置:" prop="whitelistIds"
              v-if="pgradeTaskForm.publishType==='1'&&pgradeTaskForm.publishMode==='1'">
              <el-select v-model="pgradeTaskForm.whitelistIds" multiple placeholder="请选择" class="select-drop">
                <el-option  v-for="item in whiteList"
                            default-first-option
                            :key="item.id"
                            :label="item.whiteListName"
                            :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结束时间:" prop="realGreyEndtime"
              v-if="pgradeTaskForm.publishType==='1'&&pgradeTaskForm.publishMode==='2'">
              <el-date-picker 
                class="grey-endtime"
                type="date"
                :picker-options="pickerBeginDateAfter"
                placeholder="请选择时间"
                v-model="pgradeTaskForm.realGreyEndtime"></el-date-picker>
            </el-form-item>
            <el-form-item label="灰度人数:"
              v-if="pgradeTaskForm.publishType==='1'&&pgradeTaskForm.publishMode==='2'">
              <el-input-number  class="grey-num"
                                v-model="pgradeTaskForm.greyNum" 
                                controls-position="right"
                                size="small"
                                :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="升级提示信息:">
              <el-input v-model="pgradeTaskForm.upgradeContent" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="发布描述:">
              <el-input v-model="pgradeTaskForm.memo" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="高级规则:">
              <el-table class="pade-table"
                        :data="pgradeTaskForm.greyConfigInfo"
                        v-if="pgradeTaskForm.greyConfigInfo.length>0"
                        border>
                <el-table-column  label="规格元素"  prop="ruleElement"></el-table-column>
                <el-table-column  label="规则运算"  prop="operation"></el-table-column>
                <el-table-column  label="规格值名称"  prop="value"></el-table-column>
                <el-table-column  label="操作"  prop="publishType">
                  <template slot-scope="scope">
                    <el-popover placement="top" 
                                width="160" 
                                ref="popover{{$index}}" 
                                v-model="scope.row.confirmDelete">
                      <p class="povP"><i class="el-icon-warning"></i> 确认删除吗？</p>
                      <div class="povD">
                        <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                        <el-button type="primary" size="mini"  @click.native.prevent="deletePackageInfoIdBtn(scope.$index, scope.row)">
                          确定
                        </el-button>
                      </div>
                    </el-popover>
                    <el-button
                      type="text"
                      v-popover:popover{{$index}}
                      size="small">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button icon="el-icon-plus" class="add-btn"
                        size="small"
                        @click="addGreyConfigInfoBtn">添加</el-button>
              <el-dialog title="添加高级规则" :visible.sync="qryResourceListVisible">
                <el-form  :model="qryResourceListForm" 
                          ref="qryResourceListForm" 
                          label-width="100px" 
                          class="demo-dynamic" 
                          :rules="qryResourceListFormRules">
                  <el-form-item label="类型:" prop="resourceType">
                    <el-select  v-model="qryResourceListForm.resourceType" 
                                @change="changeSelect" 
                                size="small">
                      <el-option  v-for="lis in qryResourceListForm.resourceTypeList"
                                  :key="lis.id"
                                  :label="lis.label"
                                  :value="lis.value">
                      </el-option>
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
                        :value="lis.resourceName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="qryResourceListVisible = false" size="small">取消</el-button>
                  <el-button type="primary" @click="addUpgradeFormSubmit('qryResourceListForm')" size="small">确认</el-button>
                </div>
              </el-dialog>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="submitForm" size="small"> 确 定 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { qryWhiteList, getTaskResource, addUpgradeTask, getUpgradeTaskDetail } from '~/config/api'
export default {
  name: 'upgradeTask',
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
      pgradeTaskFormRules: {
        publishType: [
          { required: true, message: '发布类型不能为空', trigger: 'blur' }
        ],
        upgradeType: [
          { required: true, message: '升级模式不能为空', trigger: 'blur' }
        ],
        publishMode: [
          { required: true, message: '白名单不能为空', trigger: 'blur' }
        ],
        realGreyEndtime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ],
        whitelistIds: [
          { required: true, message: '白名单配置不能为空', trigger: 'blur' }
        ]
      },
      whiteList: [],
      qryResourceListVisible: false,
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
      // 资源值列表
      resourceList: [],
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
      // 路由传参接收数据
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
      }
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
    // 创建或修改发布包提交
    submitForm (formName) {
      // 结束时间处理
      var dateForm = ''
      if (this.pgradeTaskForm.publishMode === '2') {
        // 创建发布
        if (this.fatherData.selected === '1') {
          var year = this.pgradeTaskForm.realGreyEndtime.getFullYear()
          var month = this.pgradeTaskForm.realGreyEndtime.getMonth() + 1
          month = month > 10 ? month : '0' + month
          var day = this.pgradeTaskForm.realGreyEndtime.getDate()
          day = day > 10 ? day : '0' + day
          dateForm = year + '' + month + '' + day + '000000'
        } else {
          // 修改发布
          dateForm = this.pgradeTaskForm.realGreyEndtime.split('-').join('') + '000000'
        }
      }
      var greyInfo = this.pgradeTaskForm.greyConfigInfo
      if (greyInfo.length > 0) {
        greyInfo.forEach(res => {
          res.operation = res.operation === '包含' ? '1' : res.operation === '不包含' ? '2' : res.operation === '范围内' ? '3' : res.operation === '范围外' ? '4' : res.operation
        })
      }
      var sendItem = {
        packageInfoId: this.fatherData.packageInfoId,
        publishType: this.pgradeTaskForm.publishType,
        upgradeType: this.pgradeTaskForm.upgradeType,
        upgradeType1: this.pgradeTaskForm.upgradeType1,
        upgradeContent: this.pgradeTaskForm.upgradeContent,
        memo: this.pgradeTaskForm.memo,
        publishMode: this.pgradeTaskForm.publishMode,
        whitelistIds: this.pgradeTaskForm.whitelistIds.join(','),
        greyConfigInfo: JSON.stringify(greyInfo),
        greyNum: this.pgradeTaskForm.greyNum,
        realGreyEndtime: dateForm,
        realGreyEndtype: ''
      }
      if (this.fatherData.selected === '2') {
        sendItem.id = this.fatherData.id
      }
      // 增加发布包
      addUpgradeTask(sendItem).then(res => {
        if (res.data.body.errorCode === '0') {
          this.Notification('成功', '添加发布包成功！')
          this.$router.push('/main/upgradeManage')
        }
      })
    },
    // 获取资源列表
    getTaskResourceFunc (tpe) {
      var tskItem = {
        platform: this.fatherData.platform === 'Android' ? '1' : this.fatherData.platform === 'IOS' ? '2' : this.fatherData.platform,
        resourceType: tpe
      }
      getTaskResource(tskItem).then(res => {
        this.resourceList = res.data.body.resourceList
      })
    },
    // 获取白名单列表
    getQryWhiteListFunc () {
      qryWhiteList().then(res => {
        this.whiteList = res.data.body.whiteList
      })
    },
    // 添加高级规则按钮
    addGreyConfigInfoBtn () {
      this.qryResourceListVisible = true
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
    // 高级规则添加确认按钮
    addUpgradeFormSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 增加高级规则数据
          var qryResourceLi = {
            ruleElement: this.qryResourceListForm.resourceType,
            operation: this.qryResourceListForm.operationType === '1' ? '包含' : this.qryResourceListForm.operationType === '2' ? '不包含' : this.qryResourceListForm.operationType === '3' ? '范围内' : '范围外',
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
    },
    changePublishType (val) {
      if (this.fatherData.selected === '1') {
        if (val === '2') {
          this.pgradeTaskForm.realGreyEndtime = new Date()
        }
      }
    },
    // 切换升级模式与提示模式
    upgradeTypeChangeFunc1 (val) {
      if (this.pgradeTaskForm.upgradeType2) {
        this.pgradeTaskForm.upgradeType = val
      }
    },
    // 发布模式切换
    upgradeTypeChangeFunc2 (val) {
      this.pgradeTaskForm.upgradeType = val
    }
  },
  beforeMount () {
    this.fatherData.selected = this.$route.query.selected
    this.fatherData.platform = this.$route.query.platform
    this.fatherData.pageMenu = this.$route.query.pageMenu
    this.fatherData.version = this.$route.query.productVersion
    this.fatherData.packageInfoId = this.$route.query.packageInfoId
    this.getQryWhiteListFunc()
    this.getTaskResourceFunc('version')
    // 创建发布页面
    if (this.fatherData.selected === '1') {
      this.fatherData.isEnterprise = this.$route.query.isEnterprise
    } else {
      // 修改发布页面
      this.fatherData.id = this.$route.query.id
      var sendItem = {
        taskId: this.$route.query.id
      }
      // 任务详情查询
      getUpgradeTaskDetail(sendItem).then(res => {
        var upgradeTaskDetail = res.data.body
        // 发布类型
        this.pgradeTaskForm.publishType = upgradeTaskDetail.publishType
        // 升级模式和提示模式
        this.pgradeTaskForm.upgradeType = upgradeTaskDetail.upgradeType
        if (upgradeTaskDetail.upgradeType === '1') {
          this.pgradeTaskForm.upgradeType1 = '1'
          this.pgradeTaskForm.upgradeType2 = '1'
        } else if (upgradeTaskDetail.upgradeType === '2') {
          this.pgradeTaskForm.upgradeType1 = '1'
          this.pgradeTaskForm.upgradeType2 = '2'
        } else {
          this.pgradeTaskForm.upgradeType1 = upgradeTaskDetail.upgradeType
        }
        // 发布模式
        this.pgradeTaskForm.publishMode = upgradeTaskDetail.publishMode
        // 时间窗结束时间
        if (upgradeTaskDetail.realGreyEndtime) {
          this.pgradeTaskForm.realGreyEndtime = upgradeTaskDetail.realGreyEndtime.slice(0, 4) + '-' + upgradeTaskDetail.realGreyEndtime.slice(4, 6) + '-' + upgradeTaskDetail.realGreyEndtime.slice(6, 8)
        } else {
          this.pgradeTaskForm.realGreyEndtime = upgradeTaskDetail.realGreyEndtime
        }
        // 白名单配置
        upgradeTaskDetail.whitelistIds.forEach(res => {
          this.pgradeTaskForm.whitelistIds.push(res.id)
        })
        // 灰度人数
        this.pgradeTaskForm.greyNum = upgradeTaskDetail.greyNum
        // 升级提示信息
        this.pgradeTaskForm.upgradeContent = upgradeTaskDetail.upgradeContent
        // 发布描述
        this.pgradeTaskForm.memo = upgradeTaskDetail.memo
        // 新版本发布
        JSON.parse(upgradeTaskDetail.greyConfigInfo).subRules.forEach(res => {
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


