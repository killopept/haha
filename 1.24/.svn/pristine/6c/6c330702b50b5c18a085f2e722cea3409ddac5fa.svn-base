<template>
  <el-container  v-loading="companyLoading">
    <!-- 新增公司信息 -->
    <el-header style="text-align: left; font-size: 12px; line-height: 80px">
      <el-button type="primary" size="mini" @click="handleInfo('add')">新增公司信息</el-button>
    </el-header>
    <!-- 页面主体显示公司列表 -->
    <el-main>
      <el-table :data="company" style="100%">
        <el-table-column prop="system" label="系统名" style="25%">
        </el-table-column>
        <el-table-column prop="url" label="域名" style="40%">
        </el-table-column>
        <el-table-column label="操作" style="30%">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="nomargin" @click="handleInfo('change', scope.row)">修改信息</el-button>
            <span class="divide">|</span>
            <el-button size="mini" type="text" class="nomargin" @click="handleLimit(scope.row.registerId)">管理权限</el-button>
            <span class="divide">|</span>
            <el-popover placement="top" width="160" ref="popover{{$index}}" v-model="scope.row.confirmDelete">
              <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
              <div style="text-align: right">
                <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteInfo(scope.row.registerId)">确定</el-button>
              </div>
            </el-popover>
            <el-button size="mini" type="text" class="nomargin" v-popover:popover{{$index}}>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 公司列表分页 -->
    <el-footer>
      <el-pagination background layout="total, sizes, prev, pager, next" 
                     :total="companyPage.total" 
                     :current-page.sync="companyPage.currentPage"
                     :page-size="companyPage.turnPageShowNum"
                     :page-sizes="[10, 20, 30, 40, 50]"
                     @current-change="switchPage"
                     @size-change="sizeChange"
      ></el-pagination>
    </el-footer>
    <!-- 修改&添加公司信息模态弹框 -->
    <el-dialog title="公司信息" :visible.sync="infoVisible" class="third-party-list" @close="infoClose">
      <div style="width: 80%">
        <el-form :model="companyInfo" :rules="infoRules" label-width="150px" label-position="right" ref="companyForm">
          <el-form-item label="系统名" prop="h5System">
            <el-input v-model="companyInfo.h5System"></el-input>
          </el-form-item>
          <el-form-item label="域名" prop="h5Domain">
            <el-input v-model="companyInfo.h5Domain"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="infoVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="infoConfirm('companyForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 管理权限模态弹框 -->
    <el-dialog title="配置权限方法" :visible.sync="limitVisible" class="third-party-list" @close="closeLimit">
      <el-container v-show="!funcList" v-loading="moduleLoading">
        <el-header style="height: auto">
          <el-alert title="直接提交整个模块的权限，或点击模块选择具体权限方法"
                    type="info"
                    show-icon
                    :closable="false"
          ></el-alert>
        </el-header>
        <el-main>
          <el-table :data="moduleData" ref="moduleTable" @select="moduleSelect">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="模块">
              <template slot-scope="scope">
                <el-button type="text" @click="handleFuncList(scope.$index, scope.row)">{{scope.row.moduleName}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer style="text-align: right;height: 45px">
          <el-pagination background layout="prev, pager, next" 
                         :total="modulePage.total" 
                         :current-page.sync="modulePage.currentPage"
                         :page-size="modulePage.turnPageShowNum"
          ></el-pagination>
        </el-footer>
      </el-container>
      <el-container v-show="funcList" v-loading="funcLoading">
        <el-header style="height: auto">
          <el-alert title="直接提交整个模块的权限，或点击模块选择具体权限方法"
                    type="info"
                    show-icon
                    :closable="false"
          ></el-alert>
        </el-header>
        <el-main>
          <el-table :data="funcData" ref="funcTable" @select="funcSelect">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="方法名" prop="funcName"></el-table-column>
          </el-table>
        </el-main>
        <el-footer style="text-align: right;height: 45px">
          <el-pagination background layout="prev, pager, next" 
                         :total="funcPage.total" 
                         :current-page.sync="funcPage.currentPage"
                         :page-size="funcPage.turnPageShowNum"
          ></el-pagination>
        </el-footer>
      </el-container>
      <div slot="footer">
        <el-button v-if="funcList" @click="returnModule" size="mini" type="info">保存并返回</el-button>
        <el-button @click="limitVisible = false" size="mini">取 消</el-button>
        <el-button v-if="funcList || canSubmit" type="primary" @click="submitLimit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
  
</template>

<script>
  import {
    queryCompanyList,
    addCompanyInfo,
    delCompanyInfo,
    queryModuleList,
    queryOwnFunctionList,
    changeFunctionList,
    submitModuleList
  } from '~/config/api'

  export default {
    data () {
      return {
        companyPage: {
          currentPage: 1,
          turnPageShowNum: 10,
          total: 10
        },
        modulePage: {
          currentPage: 1,
          turnPageShowNum: 5,
          total: 5
        },
        funcPage: {
          currentPage: 1,
          turnPageShowNum: 5,
          total: 5
        },
        companyInfo: {
          h5RegisterId: '',
          h5System: '',
          h5Domain: ''
        },
        infoRules: {
          h5System: [
            { required: true, message: '请输入系统名', trigger: 'blur' }
          ],
          h5Domain: [
            { required: true, message: '请输入域名', trigger: 'blur' }
          ]
        },
        funcList: false,
        limitVisible: false,
        infoVisible: false,
        canSubmit: false,
        moduleIndex: -1,
        moduleData: [],
        funcData: [],
        company: [],
        companyLoading: false,
        funcLoading: false,
        moduleLoading: false
      }
    },
    mounted () {
      this.getCompanyList()
    },
    methods: {
      handleInfo (mode, data = {}) {
        this.infoVisible = true
        if (mode === 'add') {
          for (let i in this.companyInfo) {
            this.companyInfo[i] = ''
          }
        } else if (mode === 'change') {
          this.companyInfo.h5System = data.system
          this.companyInfo.h5Domain = data.url
          this.companyInfo.h5RegisterId = data.registerId
        }
      },
      infoConfirm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            addCompanyInfo(this.companyInfo).then(res => {
              this.handleMsg(res, '修改成功', '修改失败')
            }).then(setTimeout(() => { this.getCompanyList() }, 100))
            this.infoVisible = false
          }
        })
      },
      infoClose () {
        for (let i in this.companyInfo) {
          this.companyInfo[i] = ''
        }
        this.$refs.companyForm.clearValidate()
      },
      handleFuncList (index, row) {
        this.funcLoading = true
        this.moduleIndex = index
        const data = {
          permissionPid: row.moduleId,
          h5RegisterId: this.moduleData.registerId
        }
        queryOwnFunctionList(data).then(res => {
          const data = res.data.body
          // this.funcPage.total = parseInt(data.turnPageTotalNum)
          this.funcData = []
          data.h5PermissionList.forEach((val, index) => {
            this.funcData.push({
              funcName: val.h5Name,
              funcId: val.h5PermissionId,
              relStatus: val.relStatus,
              index
            })
          })
          this.funcLoading = false
          setTimeout(() => {
            this.funcData.forEach(val => {
              this.$refs.funcTable.toggleRowSelection(val, val.relStatus === '1')
            })
          }, 20)
        })
        this.funcList = true
      },
      switchPage () {
        this.getCompanyList()
      },
      sizeChange (val) {
        this.companyPage.turnPageShowNum = val
        this.getCompanyList()
      },
      getCompanyList () {
        this.companyLoading = true
        queryCompanyList(this.companyPage).then(res => {
          const data = res.data.body
          this.companyPage.total = parseInt(data.turnPageTotalNum)
          this.company = []
          data.h5PermissionList.forEach(val => {
            this.company.push({
              system: val.h5System,
              url: val.h5Domain,
              registerId: val.h5RegisterId,
              h5Name: val.h5Name,
              h5PermissionId: val.h5PermissionId,
              relStatus: val.relStatus,
              confirmDelete: false
            })
          })
          this.companyLoading = false
        })
      },
      deleteInfo (id) {
        const data = { h5RegisterId: id }
        delCompanyInfo(data).then(res => {
          this.handleMsg(res, '删除成功', '删除失败')
        }).then(setTimeout(() => { this.getCompanyList() }, 100))
      },
      handleMsg (res, sucMsg, failMsg) {
        if (res.data.body.errorCode === '0') {
          this.$notify({
            title: '成功',
            message: sucMsg,
            duration: 2000,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: failMsg,
            duration: 2000,
            type: 'error'
          })
        }
      },
      handleLimit (id) {
        this.moduleLoading = true
        this.limitVisible = true
        const data = {
          currentPage: this.modulePage.currentPage,
          turnPageShowNum: this.modulePage.turnPageShowNum,
          h5RegisterId: id
        }
        queryModuleList(data).then(res => {
          const data = res.data.body
          this.modulePage.total = parseInt(data.turnPageTotalNum)
          this.moduleData = []
          data.h5PermissionList.forEach((val, index) => {
            this.moduleData.push({
              moduleName: val.h5Name,
              moduleId: val.h5PermissionId,
              relStatus: val.relStatus,
              index
            })
            this.moduleData.registerId = id
          })
          this.moduleLoading = false
          // 不设置延时显示不出来勾选，可能是数据变化触发有延时
          setTimeout(() => {
            this.moduleData.forEach(val => {
              this.$refs.moduleTable.toggleRowSelection(val, val.relStatus === '1')
            })
          }, 20)
        })
      },
      // 关闭权限管理弹框回调
      closeLimit () {
        this.moduleIndex = -1
        this.funcList = false
        this.canSubmit = false
      },
      // 权限管理修改
      changeLimit () {
        const data = {
          h5Id: this.moduleData.registerId,
          h5PermissionList: []
        }
        this.moduleData.forEach(val => {
          data.h5PermissionList.push({
            h5PermissionId: val.moduleId,
            relStatus: val.relStatus
          })
        })
        if (this.funcList === true) {
          this.funcData.forEach(val => {
            data.h5PermissionList.push({
              h5PermissionId: val.funcId,
              relStatus: val.relStatus
            })
          })
          changeFunctionList(data).then(res => {
            this.handleMsg(res, '权限修改成功', '权限修改失败')
          })
        } else {
          submitModuleList(data).then(res => {
            this.handleMsg(res, '权限修改成功', '权限修改失败')
          })
        }
      },
      // 提交权限修改
      submitLimit () {
        this.changeLimit()
        this.limitVisible = false
      },
      // 功能返回模块，先保存
      returnModule () {
        this.changeLimit()
        setTimeout(() => {
          this.moduleData.forEach(val => {
            this.$refs.moduleTable.toggleRowSelection(val, val.relStatus === '1')
          })
        }, 20)
        this.funcList = false
      },
      moduleSelect (data, row) {
        this.canSubmit = true
        this.moduleData[row.index].relStatus = this.moduleData[row.index].relStatus === '1' ? null : '1'
      },
      funcSelect (data, row) {
        if (data.length > 0) {
          this.moduleData[this.moduleIndex].relStatus = '1'
        }
        this.funcData[row.index].relStatus = this.funcData[row.index].relStatus === '1' ? null : '1'
      }
    }
  }
</script>