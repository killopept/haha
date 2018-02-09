<template>
  <div class="page-hotTask" style="padding: 20px 30px;">
    <div class="page-table" style="width: 100%;margin: 0 auto;padding: 20px 30px;">
      <el-container>
        <el-header 
          style="margin-bottom:10px;color: rgb(64, 64, 64);font-size: 14px;font-weight: 600;line-height:60px;" 
          class="border">
          <router-link to="/main/hotpatchManage">
            <i class="el-icon-arrow-left" style="margin-right:15px;"></i>
            <span> 
             <span>{{fatherData.version}}</span>
             <span style="margin-left:10px;">{{fatherData.platform==='1'?'Android':fatherData.platform==='2'?'IOS':fatherData.platform}}</span>
            </span>
          </router-link>
        </el-header>
        <el-main class="border main">
          <h3 style="border-bottom:1px solid #e9e9e9;height:48px;line-height:48px;padding: 0 32px;">{{fatherData.pageMenu}}</h3>
          <div class="taskContent">
            <el-form 
              label-position="right" 
              size="small" 
              label-width="150px" 
              :model="HotpatchTask" 
              :rules="pgradeTaskFormRules" 
              ref="HotpatchTask">
              <el-form-item label="发布类型:" prop="publishType">
                <el-radio-group v-model="HotpatchTask.publishType" size="small">
                  <el-radio label="1" value="1">灰度</el-radio>
                  <el-radio label="2" value="2">正式</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="发布模式:" prop="publishMode"
                v-if="HotpatchTask.publishType==='1'">
                <el-radio-group v-model="HotpatchTask.publishMode" size="small" @change="changePublishType">
                  <el-radio label="1" value="1">白名单</el-radio>
                  <el-radio label="2" value="2">时间窗</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="白名单配置:" prop="whitelistIds"
                v-if="HotpatchTask.publishType==='1' && HotpatchTask.publishMode==='1'">
                <el-select v-model="HotpatchTask.whitelistIds" multiple placeholder="请选择">
                  <el-option
                    v-for="item in whiteList"
                    default-first-option
                    :key="item.id"
                    :label="item.whiteListName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结束时间:" prop="realGreyEndtime"
                v-if="HotpatchTask.publishType==='1' && HotpatchTask.publishMode==='2'">
                <el-date-picker 
                  class="grey-endtime"
                  type="date"
                  :picker-options="pickerBeginDateAfter"
                  placeholder="请选择时间"
                  v-model="HotpatchTask.realGreyEndtime"></el-date-picker>
              </el-form-item>
              <el-form-item label="灰度人数:"
                v-if="HotpatchTask.publishType==='1' && HotpatchTask.publishMode==='2'">
                <el-input-number 
                  class="grey-num"
                  v-model="HotpatchTask.greyNum" 
                  controls-position="right"
                  size="small"
                  :min="1" :max="1000"></el-input-number>
              </el-form-item>
              <el-form-item label="发布描述:">
                <el-input v-model="HotpatchTask.memo" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="高级规则:" v-if="HotpatchTask.publishType === '1'">
                <el-table class="pade-table"
                  :data="HotpatchTask.greyConfigInfo"
                  v-if="HotpatchTask.greyConfigInfo.length>0"
                  border>
                  <el-table-column
                    label="规格元素"
                    prop="ruleElement">
                  </el-table-column>
                  <el-table-column
                    label="规则运算"
                    prop="operation">
                  </el-table-column>
                  <el-table-column
                    label="规格值名称"
                    prop="value">
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    prop="publishType">
                    <template slot-scope="scope">
                      <el-popover 
                        placement="top" 
                        width="160" 
                        ref="popover{{$index}}" 
                        v-model="scope.row.confirmDelete">
                        <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
                        <div style="text-align: right">
                          <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                          <el-button type="primary" size="mini" 
                            @click.native.prevent="deletePackageInfoIdBtn(scope.$index, scope.row)">确定</el-button>
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
                          @click="addGreyConfigInfoBtn">添加
                </el-button>
                <el-dialog title="添加高级规则" :visible.sync="qryResourceListVisible" style="text-align:left;" >
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
                    <el-button @click="qryResourceListVisible = false">取消</el-button>
                    <el-button type="primary" @click="addUpgradeFormSubmit('qryResourceListForm')">确认</el-button>
                  </div>
                </el-dialog>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="submitForm('HotpatchTask')"> 确 定 </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import { qryWhiteList, getTaskResource, createHotpatchTask, getUpgradeTaskDetail } from '~/config/api'

export default {
  name: 'hotpatchTask',
  data () {
    return {
      HotpatchTask: {
        publishType: '1',
        upgradeType: '0',
        upgradeType1: '0',
        upgradeType2: '1',
        publishMode: '1',
        whitelistIds: [],
        memo: '新版本发布',
        greyConfigInfo: [],
        greyNum: '1000',
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
      fatherData: {
        key: '',
        platform: '',
        menu: '',
        version: '',
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 结束时间处理
          if (this.HotpatchTask.publishMode === '2') {
            if (this.$route.query.key === '2') {
              this.HotpatchTask.realGreyEndtime = this.HotpatchTask.realGreyEndtime.split('-').join('') + '000000'
            } else {
              var year = this.HotpatchTask.realGreyEndtime.getFullYear()
              var month = this.HotpatchTask.realGreyEndtime.getMonth() + 1
              month = month > 10 ? month : '0' + month
              var day = this.HotpatchTask.realGreyEndtime.getDate()
              day = day > 10 ? day : '0' + day
              this.HotpatchTask.realGreyEndtime = year + '' + month + '' + day + '000000'
            }
          }
          if (this.HotpatchTask.greyConfigInfo.length > 0) {
            this.HotpatchTask.greyConfigInfo.forEach(res => {
              res.operation = res.operation === '包含' ? '1' : res.operation === '不包含' ? '2' : res.operation === '范围内' ? '3' : res.operation === '范围外' ? '4' : res.operation
            })
          }
          var sendItem = {
            hotpatchId: this.fatherData.packageInfoId,
            publishType: this.HotpatchTask.publishType,
            memo: this.HotpatchTask.memo,
            publishMode: this.HotpatchTask.publishMode,
            whitelistIds: this.HotpatchTask.whitelistIds.join(','),
            greyConfigInfo: JSON.stringify(this.HotpatchTask.greyConfigInfo),
            greyNum: this.HotpatchTask.greyNum,
            realGreyEndtime: this.HotpatchTask.realGreyEndtime,
            realGreyEndtype: '',
            id: ''
          }
          if (this.fatherData.key === '2') {
            sendItem.id = this.fatherData.id
          }
          // 增加发布包
          createHotpatchTask(sendItem).then(res => {
            if (res.data.body.errorCode === '0') {
              var message = ''
              if (this.fatherData.key === '1') {
                message = '添加热修复成功！'
              } else {
                message = '热修复修改成功！'
              }
              this.Notification('成功', message)
              this.$router.push('/main/hotpatchManage')
            }
          })
        } else {
          return false
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
        // console.log(this.whiteList)
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
          this.HotpatchTask.greyConfigInfo.forEach(item => {
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
            this.HotpatchTask.greyConfigInfo.push(qryResourceLi)
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
      this.HotpatchTask.greyConfigInfo.splice(index, 1)
    },
    // 切换操作类型清除数据
    handleS (val) {
      this.qryResourceListForm.resourceValues = []
      this.qryResourceListForm.resourceUnderValue = ''
      this.qryResourceListForm.resourceTopValue = ''
    },
    changePublishType (val) {
      if (this.fatherData.key === '1') {
        if (val === '2') {
          this.HotpatchTask.realGreyEndtime = new Date()
        }
      }
    }
  },
  beforeMount () {
    // console.log(this.$route.query)
    this.fatherData.key = this.$route.query.key
    this.fatherData.platform = this.$route.query.platform
    this.fatherData.pageMenu = this.$route.query.pageMenu
    this.fatherData.version = this.$route.query.productVersion
    this.fatherData.packageInfoId = this.$route.query.packageInfoId
    this.getQryWhiteListFunc()
    this.getTaskResourceFunc('version')
    // 创建发布页面
    if (this.fatherData.key === '1') {
      // this.fatherData.isEnterprise = this.$route.query.isEnterprise
    } else {
      // 修改发布页面
      this.fatherData.id = this.$route.query.id
      // console.log(this.fatherData.id, 'ididid')
      var sendItem = {
        taskId: this.$route.query.id
      }
      // 任务详情查询
      getUpgradeTaskDetail(sendItem).then(res => {
        var hotTaskDetail = res.data.body
        // console.log(hotTaskDetail, '2345678')
        // 发布类型
        this.HotpatchTask.publishType = hotTaskDetail.publishType
        // 升级模式和提示模式
        if (hotTaskDetail.upgradeType === '1') {
          this.HotpatchTask.upgradeType = hotTaskDetail.upgradeType
          this.HotpatchTask.upgradeType = '1'
        } else if (hotTaskDetail.upgradeType === '2') {
          this.HotpatchTask.upgradeType = '1'
          this.HotpatchTask.upgradeType = '2'
        }
        // 发布模式
        this.HotpatchTask.publishMode = hotTaskDetail.publishMode
        // 时间窗结束时间
        if (hotTaskDetail.realGreyEndtime) {
          this.HotpatchTask.realGreyEndtime = hotTaskDetail.realGreyEndtime.slice(0, 4) + '-' + hotTaskDetail.realGreyEndtime.slice(4, 6) + '-' + hotTaskDetail.realGreyEndtime.slice(6, 8)
        } else {
          this.HotpatchTask.realGreyEndtime = hotTaskDetail.realGreyEndtime
        }
        // 白名单配置
        hotTaskDetail.whitelistIds.forEach(res => {
          this.HotpatchTask.whitelistIds.push(res.id)
        })
        // 灰度人数
        this.HotpatchTask.greyNum = hotTaskDetail.greyNum
        // 升级提示信息
        // this.HotpatchTask.upgradeContent = hotTaskDetail.upgradeContent
        // 发布描述
        this.HotpatchTask.memo = hotTaskDetail.memo
        // 新邦本发布
        // console.log((hotTaskDetail.greyConfigInfo).subRules, '1234567890')
        JSON.parse(hotTaskDetail.greyConfigInfo).subRules.forEach(res => {
          if (res.operator === '3' || res.operator === '4') {
            this.HotpatchTask.greyConfigInfo.push({
              ruleElement: res.right,
              operation: res.operator === '1' ? '包含' : res.operator === '2' ? '不包含' : res.operator === '3' ? '范围内' : '范围外',
              value: res.left.lower + '-' + res.left.upper,
              value1: res.left.lower,
              value2: res.left.upper
            })
          } else {
            this.HotpatchTask.greyConfigInfo.push({
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



