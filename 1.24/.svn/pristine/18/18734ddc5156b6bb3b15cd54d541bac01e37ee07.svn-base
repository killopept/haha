<template>
  <div class="hotpatchManage">
    <el-container class="page-table">
      <!-- 添加热修复 -->
      <el-header>
        <el-button type="primary" class="el-icon-plus" size="mini"  @click="addDialogFormVisible = true"> 添加热修复</el-button>
        <el-dialog title="添加热修复" :visible.sync="addDialogFormVisible" style="text-align:left;" >
          <el-row :gutter="0">
            <el-col :span="16" :offset="3">
              <el-form :model="addHotList" ref="addHotList" label-width="100px" class="demo-dynamic" :rules="addUpgradeFormRules" size="medium">
                <el-form-item label="平台" prop="platform">
                  <el-radio-group v-model="addHotList.platform" size="small">
                    <el-radio-button label="1" value="1">Android</el-radio-button>
                    <el-radio-button label="2" value="2">IOS</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="下载地址" prop="downloadUrl">
                  <el-input v-model="addHotList.downloadUrl" size="small" width="300"></el-input>
                </el-form-item>
                <el-form-item label="目标版本" prop="productVersion">
                  <el-input v-model="addHotList.productVersion" size="small"></el-input>
                </el-form-item>
                <el-form-item label="修复描述" prop="memo">
                  <el-input v-model="addHotList.memo" type="textarea"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addHotpatchSubmit('addHotList')">确认</el-button>
          </div>
        </el-dialog>
      </el-header>

      <!-- 热修复列表主体 -->
      <el-main>
        <el-table class="pade-table"
          v-loading="loading"
          :data="hotList"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          :highlight-current-row="true"
          @current-change="toggleRowExpansion"
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="versionTaskList" :show-header="false" class="demo-table-expand" style="width:100%;">
                <el-table-column
                  label=""
                  prop="publishType">
                </el-table-column>
                <el-table-column
                  label=""
                  prop="taskStatus">
                </el-table-column>
                <el-table-column
                  label=""
                  prop="gmtModified">
                </el-table-column>
                <!-- <el-table-column
                  label=""
                  prop="upgradeType">
                </el-table-column> -->
                <el-table-column
                  label=""
                  prop="publishType">
                  <template slot-scope="scope">
                    <div v-if="versionTaskListShow !== scope.row.taskStatus">
                      <el-button
                        type="text"
                        @click="versionTaskUpdateBtn(scope.row)"
                        size="small">
                        修改
                      </el-button>
                      <el-button type="text" size="small" @click="handlePause(scope.row)">
                        {{status}}
                      </el-button>
                      <el-button type="text" size="small" @click="handleEnd(scope.row)">
                        结束
                      </el-button>
                    </div>
                  </template>      
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="平台"></el-table-column>
          <el-table-column prop="sourceName" label="资源名称"></el-table-column>
          <el-table-column prop="sourceType" label="资源类型"></el-table-column>
          <el-table-column prop="productVersion" label="版本号"></el-table-column>
          <el-table-column prop="memo" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.stop="createTask(scope.$index, scope.row)">创建发布</el-button> 
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="版本升级详细规则" :visible.sync="versionUpgradListVisible" style="text-align:left;" >
          <el-table
            :data="versionUpgradList"
            border
            style="width: 100%">
            <el-table-column
              prop="version"
              label="版本号"
              width="310">
            </el-table-column>
            <el-table-column
              prop="upgradeType"
              label="升级类型">
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="versionUpgradListVisible = false" type="primary" size="small">确认</el-button>
          </div>
        </el-dialog>
      </el-main>

      <el-footer style="float:right;padding:20px 0;">
        <el-pagination
          v-show="hotList.length>0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="hotListPage.currentPage"
          :page-size="hotListPage.turnPageShowNum"
          layout="prev, pager, next, jumper"
          :total="parseInt(hotListPage.total)">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getHotpatchResourceList, getHotpatchTaskListByPackageId, createHotpatchResource, changeTaskStatus } from '~/config/api'
// import { changeTaskStatus, getHotpatchResourceList, createHotpatchResource, createHotpatchTask, getHotpatchTaskListByPackageId } from '~/config/api'

export default {
  name: 'hotpatchManage',
  data () {
    var checkVersion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请指定版本号'))
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
      addHotList: {
        platform: '1',
        downloadUrl: '',
        productVersion: '',
        memo: ''
      },
      addUpgradeFormRules: {
        platform: [
          { required: true, message: '平台不能为空', trigger: 'blur' }
        ],
        downloadUrl: [
          { required: true, message: '请输入下载地址', trigger: 'blur' }
        ],
        productVersion: [
          { required: true, message: '请指定版本号', trigger: 'blur' }, {
            validator: checkVersion, message: '版本号格式参考1.0.0', trigger: 'blur'}
        ]
      },
      hotList: [],
      // 获取row的key值
      getRowKeys (row) {
        return row.id
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      versionTaskList: [],
      versionTaskListShow: '已结束',
      hotListPage: {
        currentPage: 1,
        turnPageShowNum: 6,
        total: ''
      },
      versionUpgradList: [],
      status: '暂停', // 暂停还是继续状态
      queryObj: {}, // 跳转传参
      loading: false
      // loading: true
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
    deleteInfo (id) {
      // console.log(id)
      // const data = { h5RegisterId: id }
      // delCompanyInfo(data).then(res => {
      //   this.handleMsg(res, '删除成功', '删除失败')
      // }).then(setTimeout(() => { this.getCompanyList() }, 20))
    },
    // 分页列表
    gethotList (currentPg, currentPgNum) {
      var pageItem = {
        currentPage: currentPg,
        turnPageShowNum: currentPgNum
      }
      // 获取发布包列表
      getHotpatchResourceList(pageItem).then(res => {
        // console.log(res.data)
        this.loading = true
        if (res.data.body.errorCode === '0') {
          this.loading = false
          this.hotList = res.data.body.hotpatchResourceList
          this.hotListPage.total = res.data.body.turnPageTotalNum
          this.hotList.forEach(val => {
            val.platform = val.platform === '2' ? 'iOS' : 'Android'
            val.publishStatus = val.publishStatus === '0' ? '待发布' : val.publishStatus === '1' ? '灰度发布' : '正式发布'
            val.isEnterprise = val.isEnterprise === '0' ? '正式包' : '企业包'
          })
        } else {
          this.loading = false
        }
      })
    },
    // 每页显示条数
    handleCurrentChange (val) {
      this.hotListPage.currentPage = val
      this.gethotList(val, this.hotListPage.turnPageShowNum)
    },
    // 显示第几页
    handleSizeChange (val) {
      this.hotListPage.turnPageShowNum = val
      this.gethotList(this.hotListPage.currentPage, val)
    },
    // 手风琴切换
    toggleRowExpansion (row) {
      // console.log(row)
      if (row !== null) {
        this.expands = []
        this.expands.push(row.id)
        this.versionTaskList = []
        var item = {
          hotpatchId: row.id
        }
        this.getListByPackageId(item)
        // console.log(item)
      }
      // console.log(this.versionTaskList, 'shoufengq ')
      this.versionTaskList.forEach(val => {
        if (val.taskStatus === '发布中') {
          this.status = '暂停'
        }
        if (val.taskStatus === '暂停') {
          this.status = '继续'
        }
      })
    },
    // 任务列表查询
    getListByPackageId (item) {
      getHotpatchTaskListByPackageId(item).then(res => {
        this.versionTaskList = []
        res.data.body.versionTaskList.forEach(val => {
          this.versionTaskList.push(val)
        })
        this.versionTaskList.forEach(res => {
          res.publishType = res.publishType === '2' ? '正式发布' : '灰度发布'
          res.taskStatus = res.taskStatus === '2' ? '已结束' : res.taskStatus === '1' ? '发布中' : '暂停'
          res.confirmDelete = false
        })
      })
    },
    // 添加热修复
    addHotpatchSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createHotpatchResource(this.addHotList).then(res => {
            if (res.data.body.errorCode === '0') {
              this.gethotList(1, 6)
              this.addDialogFormVisible = false
              this.Notification('成功', '添加热修复成功！')
            }
          })
        } else {
          return false
        }
        // this.addHotList = []
      })
    },
    // 创建热修复任务
    createTask (index, row) {
      // console.log(row)
      // console.log(index)
      this.queryObj = {
        pageMenu: '创建发布任务',
        platform: row.platform,
        productVersion: row.productVersion,
        // isEnterprise: row.isEnterprise,
        packageInfoId: row.id,
        key: '1'
      }
      this.$router.push({path: '/main/hotpatchTask', query: this.queryObj})
    },
    versionTaskUpdateBtn (row) {
      this.queryObj = {
        platform: row.platform,
        productVersion: row.productVersion,
        // isEnterprise: row.isEnterprise,
        packageInfoId: row.id,
        key: '2',
        pageMenu: '修改发布任务',
        id: row.id
      }
      this.$router.push({path: '/main/hotpatchTask', query: this.queryObj})
    },
    // 暂停和继续
    handlePause (row) {
      // console.log(row, '234')
      var proMsg = ''
      if (row.taskStatus === '发布中') {
        this.status = '暂停'
        proMsg = '确定要暂停吗？'
        this.$confirm(proMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var rowStatus = {
            taskId: row.id.toString(),
            taskStatus: 3
          }
          var item = {
            hotpatchId: row.hotpatchId
          }
          // 状态修改
          changeTaskStatus(rowStatus).then(res => {
            // console.log(res.data.body.msg)
            this.status = '继续'
            this.$message({
              type: 'success',
              message: res.data.body.msg
            })
            this.getListByPackageId(item)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.status = '继续'
        proMsg = '确定要继续吗？'
        this.$confirm(proMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var rowStatus = {
            taskId: row.id.toString(),
            taskStatus: 1
          }
          var item = {
            hotpatchId: row.hotpatchId
          }
          // 状态修改
          changeTaskStatus(rowStatus).then(res => {
            // console.log(res.data.body.msg)
            this.status = '暂停'
            this.$message({
              type: 'success',
              message: res.data.body.msg
            })
            this.getListByPackageId(item)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 结束发布
    handleEnd (row) {
      // console.log(row)
      this.$confirm('确定要结束吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var rowStatus = {
          taskId: row.id,
          taskStatus: 2
        }
        var item = {
          hotpatchId: row.hotpatchId
        }
        // 状态修改
        changeTaskStatus(rowStatus).then(res => {
          this.$message({
            type: 'success',
            message: res.data.body.msg
          })
          this.getListByPackageId(item)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  beforeMount () {
    this.gethotList(1, 6)
  }
}
</script>
