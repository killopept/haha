<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px; line-height: 80px">
      <el-button type="primary" size="mini" @click="handleModule('add')">+ 添加离线包</el-button>
    </el-header>
    <!-- 离线包主要显示部分 -->
    <el-main>
      <el-table style="width: 100%" :data="moduleData">
        <el-table-column prop="version" label="版本号">
        </el-table-column>
        <el-table-column prop="url" label="下载地址">
        </el-table-column>
        <el-table-column prop="declare" label="更新说明">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleModule('change', scope.row)">修改</el-button>
            <el-popover placement="top" width="160" ref="popover{{$index}}" v-model="scope.row.confirmDelete">
              <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
              <div style="text-align: right">
                <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmDelete(scope.row)">确定</el-button>
              </div>
            </el-popover>
            <el-button size="mini" type="text" class="nomargin" v-popover:popover{{$index}}>删除</el-button>
            <el-button size="mini" type="text" v-if="scope.$index === 0" @click="handleModule('reAdd', scope.row)">重新打包</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 分页 -->
    <el-footer style="text-align: right">
      <el-pagination background layout="total, prev, pager, next" 
                     :total="modulePage.total" 
                     :current-page.sync="modulePage.currentPage"
                     :page-size="modulePage.pageSize"
                     @current-change="switchPage"
      ></el-pagination>
    </el-footer>
    <!-- 修改&添加离线包模态弹框 -->
    <el-dialog title="离线包管理" :visible.sync="moduleVisible" class="my-dialog" @close="closeModule">
      <div style="width: 80%">
        <el-form :model="moduleInfo" :rules="moduleRules" label-width="150px" label-position="right" ref="moduleForm">
          <el-form-item label="静态资源版本" prop="version">
            <el-input v-model="moduleInfo.version" disabled></el-input>
          </el-form-item>
          <el-form-item label="上传CID文件" v-if="handleModuleWay !== 'change'">
            <el-upload :action="uploadUrl" :on-success="uploadFile" ref="upload">
              <el-button icon="el-icon-upload2">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="下载地址" prop="url">
            <el-input type="textarea" v-model="moduleInfo.url"></el-input>
          </el-form-item>
          <!--
          <el-form-item label="静态资源获取方式">
            <el-input v-model="moduleInfo.way"></el-input>
          </el-form-item>
          -->
          <el-form-item label="模块名" prop="name">
            <el-input v-model="moduleInfo.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="更新说明" prop="declare">
            <el-input type="textarea" v-model="moduleInfo.declare"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="moduleVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmSubmit('moduleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {
    queryZipList,
    API,
    managePackageInfo,
    submitModifiedInfo,
    deleteZipVersion
  } from '~/config/api'

  export default {
    data () {
      return {
        moduleId: '',
        moduleName: '',
        uploadUrl: API.uploadModuleZipFile,
        handleModuleWay: '',
        modulePage: {
          currentPage: 1,
          pageSize: 10,
          total: 10
        },
        moduleData: [],
        moduleVisible: false,
        moduleInfo: {
          version: '',
          url: '',
          way: '',
          name: '',
          declare: ''
        },
        moduleRules: {
          version: [
            { required: true, message: '版本号不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '下载地址不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '模块名不能为空', trigger: 'blur' }
          ],
          declare: [
            { required: true, message: '更新说明不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    // 在挂载的时候保存路由里的模块id，并获取数据进行渲染
    mounted () {
      const row = JSON.parse(this.$route.params.row)
      this.moduleId = row.id
      this.moduleName = row.name
      this.getZipList()
    },
    methods: {
      // 获取离线包数据进行渲染
      getZipList () {
        const data = {
          currentPage: this.modulePage.currentPage,
          turnPageShowNum: this.modulePage.pageSize,
          zipModule: this.moduleId
        }
        queryZipList(data).then(res => {
          this.modulePage.total = parseInt(res.data.body.turnPageTotalNum)
          const zip = res.data.body.zipVersionList
          // 对数据进行初始化和数据处理
          this.moduleData = []
          zip.forEach(val => {
            this.moduleData.push({
              version: val.endVersion,
              domain: val.domain,
              url: val.domain + '/' + val.zipUrl,
              declare: val.staticMemo,
              id: val.zipId,
              name: val.moduleName,
              staticType: val.staticType === '0' ? '本地' : '服务端',
              confirmDelete: false
            })
            this.moduleInfo.url = val.domain
          })
        })
      },
      // 切换分页时候重新获取离线包数据
      switchPage () {
        this.getZipList()
      },
      // 修改和重新打包的时候，需要获取当前行的数据填写到表单中
      handleModule (type, row = {}) {
        this.handleModuleWay = type
        if (type !== 'add') {
          this.moduleInfo = {
            version: row.version,
            url: row.domain,
            way: row.staticType,
            name: row.name,
            declare: row.declare
          }
        }
        this.moduleInfo.name = this.moduleName
        this.moduleVisible = true
      },
      // 关闭模态框时候对于一些数据，上传组件，以及表单进行初始化
      closeModule () {
        this.moduleInfo = {}
        this.moduleInfo.url = this.moduleData[0].domain
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
        this.$refs.moduleForm.clearValidate()
      },
      // 上传文件成功的时候讲后台返回的静态版本号保存起来
      uploadFile (res) {
        if (res.body.errorCode === '0') {
          this.moduleInfo.version = res.body.staticVersion
        } else {
          alert(res.body.errorMsg)
        }
      },
      // 发送表单数据 添加/修改/重新打包
      sendModuleInfo () {
        const data = {
          staticVersion: this.moduleInfo.version,
          staticMemo: this.moduleInfo.declare,
          zipDownloadUrl: this.moduleInfo.url,
          staticType: '0',
          zipModule: this.moduleId
        }
        if (this.handleModuleWay !== 'change') {
          managePackageInfo(data).then(res => {
            this.handleMsg(res, '打包成功', '打包失败')
          }).then(setTimeout(() => { this.getZipList() }, 100))
        } else {
          submitModifiedInfo(data).then(res => {
            this.handleMsg(res, '修改离线包成功', '修改离线包失败')
          }).then(setTimeout(() => { this.getZipList() }, 100))
        }
      },
      // 验证表单后再请求数据
      confirmSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.moduleVisible = false
            this.sendModuleInfo()
          } else {
            return false
          }
        })
      },
      // 删除离线包
      confirmDelete (row) {
        const data = { staticVersion: row.version }
        deleteZipVersion(data).then(res => {
          this.handleMsg(res, '删除离线包成功', '删除离线包失败')
        }).then(setTimeout(() => { this.getZipList() }, 100))
      },
      // 封装消息弹框
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
      }
    }
  }
</script>