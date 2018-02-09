<template>
  <div class="upGradeManage">
    <el-container class="page-table">
      <!-- 添加发布包按钮 -->
      <el-header>
        <el-button type="primary" 
                  class="el-icon-plus"
                  size="mini"  
                  @click="addDialogFormVisible = true"> 添加发布包</el-button>
        <el-dialog title="添加发布包" :visible.sync="addDialogFormVisible">
          <el-form :model="addUpgradeForm" ref="addUpgradeForm"
                  label-width="100px" class="demo-dynamic"
                  :rules="addUpgradeFormRules">
            <el-form-item label="平台:" prop="platform">
              <el-radio-group v-model="addUpgradeForm.platform" size="small" @change="platformChange">
                <el-radio-button label="1" value="1">Android</el-radio-button>
                <el-radio-button label="2" value="2">IOS</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发布类型:" prop="isEnterprise"
                          v-if="addUpgradeForm.platform === '2'">
              <el-radio-group v-model="addUpgradeForm.isEnterprise" size="small" @change="platformChange">
                <el-radio label="0" value="0">企业版</el-radio>
                <el-radio label="1" value="1">正式版</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="appstore地址:" prop="appstoreUrl" 
                          v-if="addUpgradeForm.isEnterprise === '1' && addUpgradeForm.platform === '2'">
              <el-input v-model="addUpgradeForm.appstoreUrl" size="small" width="300"></el-input>
            </el-form-item>
            <el-form-item label="下载地址:" prop="downloadUrl">
              <el-input v-model="addUpgradeForm.downloadUrl" size="small" width="300"></el-input>
            </el-form-item>
            <el-form-item label="版本号:" prop="productVersion">
              <el-input v-model="addUpgradeForm.productVersion" size="small"></el-input>
            </el-form-item>
            <el-form-item label="符号表文件:" v-if="addUpgradeForm.platform === '2'" prop="iosSymbol">
              <el-input v-model="addUpgradeForm.iosSymbol" size="small"></el-input>
            </el-form-item>
            <el-form-item label="发布描述:" prop="desc">
              <el-input v-model="addUpgradeForm.desc" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="addUpgradeFormSubmit('addUpgradeForm')" size="small">确认</el-button>
          </div>
        </el-dialog>
      </el-header>
      <!-- 版本列表 -->
      <el-main>
        <el-table class="pade-table"
                  :data="upgradeList"
                  :row-key="getRowKeys"
                  :expand-row-keys="expands"
                  :highlight-current-row="true"
                  @current-change="toggleRowExpansion"
                  width= "100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="versionTaskList" :show-header="false" class="demo-table-expand" width="100%">
                <el-table-column  label=""  prop="publishType"></el-table-column>
                <el-table-column  label=""  prop="taskStatus"></el-table-column>
                <el-table-column  label=""  prop="gmtCreate"></el-table-column>
                <el-table-column  label=""  prop="upgradeType"></el-table-column>
                <el-table-column  label=""  prop="publishType">
                  <template slot-scope="scope">
                    <div v-show="versionTaskListShow !== scope.row.taskStatus">
                      <el-button
                        type="text"
                        @click="versionTaskUpdateBtn(scope.row)"
                        size="small">
                        修改
                      </el-button>
                      <el-popover placement="top" width="160" ref="popover2{{$index}}" v-model="scope.row.confirmDelete">
                        <p class="povP"><i class="el-icon-warning"></i> 确认{{scope.row.taskStatus === '发布中'?'暂停':'继续'}}吗？</p>
                        <div class="povD">
                          <el-button size="mini" @click="gobackBtn">取消</el-button>
                          <el-button type="primary" size="mini" @click="toggleStatusInfo(scope.row , 0)">确定</el-button>
                        </div>
                      </el-popover>
                      <el-button
                        type="text"
                        v-if="scope.row.taskStatus === '发布中'"
                        v-popover:popover2{{$index}}
                        size="small">
                        暂停
                      </el-button>
                      <el-button
                        type="text"
                        v-if="scope.row.taskStatus === '暂停'"
                        v-popover:popover2{{$index}}
                        size="small">
                        继续
                      </el-button>
                      <el-popover placement="top" width="160" ref="popover1{{$index}}" v-model="scope.row.confirmDelete">
                        <p class="povP"><i class="el-icon-warning"></i> 确认删除吗？</p>
                        <div class="povD">
                          <el-button size="mini" @click="gobackBtn">取消</el-button>
                          <el-button type="primary" size="mini" @click="toggleStatusInfo(scope.row, 1)">确定</el-button>
                        </div>
                      </el-popover>
                      <el-button
                        type="text"
                        v-popover:popover1{{$index}}
                        size="small">
                        结束
                      </el-button>
                    </div>
                  </template>      
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column  label="平台"   prop="platform"> </el-table-column>
          <el-table-column  label="版本号"  prop="productVersion"></el-table-column>
          <el-table-column  label="发布状态"   prop="publishStatus"></el-table-column>
          <el-table-column  label="发布包类型"   prop="isEnterprise"></el-table-column>
          <el-table-column  label="创建时间"  prop="gmtCreate"></el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.stop="updateEdit(scope.$index, scope.row)">创建发布</el-button> 
              <el-button type="text" size="small" @click.stop="detailRow(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="版本升级详细规则" :visible.sync="versionUpgradListVisible">
          <el-table
            class="version-detail-table"
            :data="versionUpgradList"
            border
            width="100%">
            <el-table-column
              prop="version"
              label="版本号">
            </el-table-column>
            <el-table-column
              prop="upgradeType"
              label="升级类型">
            </el-table-column>
          </el-table>
          <div class="detail-foot" v-show="versionUpgradList.length>0">
            <el-pagination
              v-show="versionUpgradList.length>0"
              background
              @current-change="handleCurrentListChange"
              :current-page.sync="versionUpgradListPage.currentPage"
              :page-size="versionUpgradListPage.turnPageShowNum"
              layout="prev, pager, next, jumper"
              :total="parseInt(versionUpgradListPage.total)">
            </el-pagination>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="versionUpgradListVisible = false" type="primary" size="small">确认</el-button>
          </div>
        </el-dialog>
      </el-main>
      <!-- 页码 -->
      <el-footer>
        <el-pagination
          v-show="upgradeList.length>0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="upgradeListPage.currentPage"
          :page-size="upgradeListPage.turnPageShowNum"
          layout="prev, pager, next, jumper"
          :total="parseInt(upgradeListPage.total)">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getUpdateList, getUpgradeTask, addUpgradeList, getVersionDetail, changeVersionTaskStatus } from '~/config/api'
export default {
  name: 'upgradeManage',
  data () {
    var checkVersion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('版本号不能为空'))
      } else {
        var reg = /^\d+(\.\d+)*$/
        if (!reg.test(value)) {
          callback(new Error('版本号格式参考1.0.0'))
        } else {
          callback()
        }
      }
    }
    return {
      addDialogFormVisible: false,
      versionUpgradListVisible: false,
      // 添加发布包
      addUpgradeForm: {
        platform: '2',
        isEnterprise: '0',
        appstoreUrl: '',
        downloadUrl: '',
        productVersion: '',
        iosSymbol: '',
        desc: ''
      },
      addUpgradeFormRules: {
        platform: [
          { required: true, message: '平台不能为空', trigger: 'blur' }
        ],
        isEnterprise: [
          { required: true, message: '发布类型不能为空', trigger: 'blur' }
        ],
        appstoreUrl: [
          { required: true, message: 'appstore地址不能为空', trigger: 'blur' }
        ],
        downloadUrl: [
          { required: true, message: '下载地址不能为空', trigger: 'blur' }
        ],
        iosSymbol: [
          { required: true, message: '符号表文件不能为空', trigger: 'blur' }
        ],
        productVersion: [
          { required: true, message: '版本号不能为空', trigger: 'blur' }, {
            validator: checkVersion, message: '版本号格式参考1.0.0', trigger: 'blur'}
        ]
      },
      upgradeList: [],
      // 获取row的key值
      getRowKeys (row) {
        return row.id
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      versionTaskList: [],
      versionTaskListShow: '已结束',
      upgradeListPage: {
        currentPage: 1,
        turnPageShowNum: 10,
        total: ''
      },
      versionUpgradList: [],
      versionUpgradListPage: {
        currentPage: 1,
        turnPageShowNum: 10,
        total: ''
      },
      currentDetailRow: {
        platform: '1',
        packageInfoId: ''
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
    // 修改发布包状态
    changeVersionTaskStatus (id, sta, infoId) {
      var staItem = {
        taskId: id,
        taskStatus: sta
      }
      var staTaskItem = {packageInfoId: infoId}
      changeVersionTaskStatus(staItem).then(res => {
        if (res.data.body.errorCode === '0') {
          this.Notification('成功', '操作成功')
        } else {
          this.Notification('失败', '操作失败', 'error')
        }
      }).then(setTimeout(() => { this.getUpgradeTaskFunc(staTaskItem) }, 20))
    },
    // 切换发布包状态
    toggleStatusInfo (msg, isDel) {
      var statBtn = 2
      if (isDel === 1) {
        statBtn = 2
      } else if (msg.taskStatus === '发布中') {
        statBtn = 3
      } else if (msg.taskStatus === '暂停') {
        statBtn = 1
      }
      this.changeVersionTaskStatus(msg.id, statBtn, msg.packageInfoId)
      document.body.click()
    },
    // 升级版本包分页列表
    getUpdateListPageShow (currentPg, currentPgNum) {
      var pageItem = {
        currentPage: currentPg,
        turnPageShowNum: currentPgNum
      }
      // 获取发布包列表
      getUpdateList(pageItem).then(res => {
        this.upgradeList = res.data.body.upgradeList
        this.upgradeListPage.total = res.data.body.turnPageTotalNum
        this.upgradeList.forEach(val => {
          val.platform = val.platform === '2' ? 'IOS' : 'Android'
          val.publishStatus = val.publishStatus === '0' ? '待发布' : val.publishStatus === '1' ? '灰度发布' : '正式发布'
          val.isEnterprise = val.isEnterprise === '0' ? '企业包' : '正式包'
        })
      })
    },
    // 每页显示条数
    handleCurrentChange (val) {
      this.expands = []
      this.upgradeListPage.currentPage = val
      this.getUpdateListPageShow(val, this.upgradeListPage.turnPageShowNum)
    },
    // 任务列表查询
    getUpgradeTaskFunc (data) {
      getUpgradeTask(data).then(res => {
        this.versionTaskList = res.data.body.versionTaskList
        this.versionTaskList.forEach(res => {
          res.publishType = res.publishType === '2' ? '正式发布' : '灰度发布'
          res.taskStatus = res.taskStatus === '1' ? '发布中' : res.taskStatus === '2' ? '已结束' : '暂停'
          res.upgradeType = res.upgradeType === '0' ? '忽略更新' : res.upgradeType === '1' ? '单次提醒' : res.upgradeType === '2' ? '多次提醒' : '强制更新'
          res.confirmDelete = false
        })
      })
    },
    // 显示第几页
    handleSizeChange (val) {
      this.expands = []
      this.upgradeListPage.turnPageShowNum = val
      this.getUpdateListPageShow(this.upgradeListPage.currentPage, val)
    },
    // 手风琴切换
    toggleRowExpansion (row) {
      if (row !== null) {
        this.expands = []
        this.expands.push(row.id)
        this.versionTaskList = []
        var item = { packageInfoId: row.id }
        this.getUpgradeTaskFunc(item)
      }
    },
    // 添加发布包
    addUpgradeFormSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 增加发布包
          addUpgradeList(this.addUpgradeForm).then(res => {
            if (res.data.body.errorCode === '0') {
              this.getUpdateListPageShow(1, 10)
              this.addDialogFormVisible = false
              this.Notification('成功', '添加发布包成功！')
            }
          })
        } else {
          return false
        }
        // this.addUpgradeForm = []
      })
    },
    // 添加发布包-平台切换
    platformChange () {
      this.addUpgradeForm.downloadUrl = ''
      this.addUpgradeForm.productVersion = ''
      this.addUpgradeForm.desc = ''
      this.addUpgradeForm.iosSymbol = ''
      this.addUpgradeForm.appstoreUrl = ''
    },
    // 创建发布
    updateEdit (index, row) {
      var sendData = {
        selected: '1',
        pageMenu: '创建发布任务',
        platform: row.platform,
        productVersion: row.productVersion,
        isEnterprise: row.isEnterprise,
        packageInfoId: row.id
      }
      this.$router.push({path: '/main/upgradeTask', query: sendData})
    },
    // 详情
    detailRow (row, currentPg = 1, currentPgNum = 10) {
      // 获取版本更新状态信息
      if (row !== null) {
        this.versionUpgradListPage.currentPage = 1
        this.currentDetailRow.platform = row.platform === 'IOS' ? '2' : '1'
        this.currentDetailRow.packageInfoId = row.id
      }
      getVersionDetail(this.currentDetailRow).then(res => {
        this.versionUpgradList = res.data.body.versionUpgradList.slice((currentPg - 1) * 10, 10 * currentPg)
        this.versionUpgradListPage.total = res.data.body.versionUpgradList.length
        this.versionUpgradList.forEach(item => {
          item.upgradeType = item.upgradeType === '0' ? '忽略更新' : item.upgradeType === '1' ? '单次提醒' : item.upgradeType === '2' ? '多次提醒' : '强制更新'
        })
        this.versionUpgradListVisible = true
      })
    },
    // 切换详情页页码
    handleCurrentListChange (val) {
      this.detailRow('', val, 10)
    },
    // 修改
    versionTaskUpdateBtn (row) {
      var sendData2 = {
        selected: '2',
        pageMenu: '修改发布任务',
        platform: row.platform,
        productVersion: row.productVersion,
        id: row.id,
        packageInfoId: row.packageInfoId
      }
      this.$router.push({path: '/main/upgradeTask', query: sendData2})
    },
    gobackBtn () {
      document.body.click()
    }
  },
  beforeMount () {
    this.getUpdateListPageShow(1, 10)
  }
}
</script>
