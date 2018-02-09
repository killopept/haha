<template>
  <el-container class="pageNewConfig">
    <el-header style="text-align: left; font-size: 12px; line-height: 80px">
      <el-button type="primary" size="mini" @click="addClick">+ 配置增加</el-button>
    </el-header>
    <el-main>
      <el-table :data="allocationList" class="pade-table" style="width: 100%"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @current-change="toggleRowExpansion">
        <el-table-column type="expand">
          <template slot-scope="props" style="padding:0 20px;">
            <el-table :data="versionTaskList" :show-header="false" class="demo-table-expand" style="width:100%;">
              <el-table-column
                label=""
                prop="id" v-if="false">
              </el-table-column>
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
                prop="gmtCreate">
              </el-table-column>
              <el-table-column
                label=""
                prop="publishType">
                <template slot-scope="scope">
                  <div v-show="versionTaskListShow !== scope.row.taskStatus">
                    <el-button
                      type="text"
                      @click="versionTaskUpdateBtn(scope.row)"
                      size="small" v-show="publishTypeShow !== scope.row.publishType">
                      修改
                    </el-button>
                     <el-popover placement="top" width="160" ref="popover2{{$index}}" v-model="scope.row.confirmDelete">
                      <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i>确认{{scope.row.taskStatus === '发布中'?'暂停':'继续'}}吗？</p>
                      <div style="text-align: right">
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
                    <el-popover placement="top" width="160" ref="popover1{{$index}}" v-model="scope.row.confirmDelete1">
                      <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
                      <div style="text-align: right">
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
        <div v-if="isShow">
          <el-table-column prop="nebulaAllocation" label="配置ID" header-align="center">
          </el-table-column>
        </div>
        <el-table-column prop="content" label="配置描述" header-align="center">
        </el-table-column>
        <el-table-column prop="version" label="版本" header-align="center">
        </el-table-column>
        <el-table-column label="操作" header-align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.stop="getMsgDetail(scope.row,scope.$index)">详情</el-button>
            <el-dialog
              title="配置内容"
              :visible.sync="dialogVisible"
              width="30%" style="padding:20px 20px">
              <textarea style="width:300px;height:150px">{{content}}</textarea>
          </el-dialog>
          <el-popover placement="top" width="160" ref="popoverM{{$index}}" v-model="scope.row.confirmDelete2">
              <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
              <div style="text-align: right">
                <el-button size="mini" @click="scope.row.confirmDelete2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="delConfig(scope.row)">确定</el-button>
              </div>
            </el-popover>
            <el-button size="mini" type="text" @click.stop="createPublish(scope.row)">发布</el-button>
            <el-button size="mini" type="text" class="nomargin" @click.stop v-popover:popoverM{{$index}}>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="text-align: right">
      <el-pagination background layout="total, prev, pager, next" 
                     :total="modulePage.total" 
                     :current-page.sync="modulePage.currentPage"
                     :page-size="modulePage.pageSize"
                     @current-change="switchPage"
      ></el-pagination>
    </el-footer>
    <!-- 增加配置模态框 -->
    <el-dialog 
      title="增加配置" 
      :visible.sync="dialogVisible1" width="40%">   
        <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" label-width="120px">
          <el-form-item label="配置版本" prop="version">
            <el-input v-model="ruleForm2.version" placeholder="请输入版本"></el-input>
          </el-form-item>
        <el-form-item label="配置描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm2.desc"></el-input>
        </el-form-item>
        <el-form-item label="配置内容" prop="contentList">
          <el-input type="textarea" v-model="ruleForm2.contentList"></el-input>
          <input id="file" type="file" @change="onFileChange">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible1 = false" size="small">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" size="small">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
  

<script>
import {delMapping, qryMappingService, getMappingMessageService, getMappingTaskListService, addMappingService, changeVersionTaskStatus} from '~/config/api'
export default {
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
    var checkdesc = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入配置描述'))
      } else {
        callback()
      }
    }
    var checkcontentList = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传配置内容'))
      } else {
        callback()
      }
    }
    return {
      isShow: false,
      versionTaskListShow: '已结束',
      publishTypeShow: '正式发布',
      content: '',
      versionTaskList: [],
      versionTaskListnew: [],
      allocationList: [],
      modulePage: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      // form: {
      //   desc: '',
      //   desc1: ''
      // },
      dialogVisible1: false, // 模态框是否显示
      dialogVisible: false,
      // 获取row的key值
      getRowKeys (row) {
        return row.nebulaAllocation
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      // 增加表单验证
      ruleForm2: {
        version: '',
        desc: '',
        contentList: ''
      },
      rules2: {
        version: [
          { validator: checkVersion, trigger: 'blur' }
        ],
        desc: [
          { validator: checkdesc, trigger: 'blur' }
        ],
        contentList: [
          { validator: checkcontentList, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getMsgList(1, 10)
  },
  methods: {
    // 删除配置项
    delConfig (row) {
      sessionStorage.setItem('serviceMappingId', row.nebulaAllocation)
      this.allocationList.confirmDelete2 = false
      const newdata = {
        serviceMappingId: row.nebulaAllocation
      }
      this.getUpgradeTaskFuncnew(newdata)
    },
    getUpgradeTaskFuncnew (data) {
      const sendD = {
        serviceMappingId: sessionStorage.getItem('serviceMappingId')
      }
      getMappingTaskListService(data).then(res => {
        const taskList1 = res.data.body
        this.versionTaskListnew = []
        taskList1.versionTaskList.forEach(val => {
          this.versionTaskListnew.push({
            taskStatus: val.taskStatus
          })
        })
      }).then(() => {
        // console.log(this.versionTaskListnew.length)
        if (this.versionTaskListnew.length === 0) {
          this.delNewConfig(sendD)
        } else {
          var istaskStatus = 0
          this.versionTaskListnew.forEach(val => {
            if (val.taskStatus !== '2') {
              istaskStatus = 1
            }
          })
          if (istaskStatus === 1) {
            this.$confirm('您有未结束的发布,无法删除配置!', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'error'
            })
          } else {
            this.delNewConfig(sendD)
          }
        }
      }).then(() => {
        this.getMsgList(1, 10)
        document.body.click()
      })
    },
    // 删除配置项
    delNewConfig (data) {
      delMapping(data).then(res => {
        if (res.data.body.errorCode === '0') {
          this.Notification('成功', '删除成功')
        } else {
          this.Notification('失败', '删除失败', 'error')
        }
      })
    },
    // 修改按钮
    versionTaskUpdateBtn (row) {
      // console.log(row)
      var sendData2 = {
        selected: '2',
        pageMenu: '修改发布任务',
        productVersion: row.productVersion,
        serviceMappingId: row.mappingId,
        id: row.id
      }
      // console.log(sendData2)
      this.$router.push({path: '/main/createPublish', query: sendData2})
    },
    gobackBtn () {
      document.body.click()
    },
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
      var staTaskItem = {serviceMappingId: infoId}
      changeVersionTaskStatus(staItem).then(res => {
        if (res.data.body.errorCode === '0') {
          this.Notification('成功', '操作成功')
        } else {
          this.Notification('失败', '操作失败', 'error')
        }
      }).then(setTimeout(() => { this.getUpgradeTaskFunc(staTaskItem) }, 40))
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
      this.changeVersionTaskStatus(msg.id, statBtn, msg.mappingId)
      document.body.click()
    },
    switchPage () {
      this.getMsgList(1, 10)
    },
    // 进入查询
    getMsgList (currentPg, currentPgNum) {
      const dataQms = {
        currentPage: this.modulePage.currentPage,
        turnPageShowNum: this.modulePage.pageSize,
        serviceModuleId: this.$route.params.id
      }
      qryMappingService(dataQms).then(res => {
        this.modulePage.total = parseInt(res.data.body.turnPageTotalNum)
        const data = res.data.body
        this.allocationList = []
        data.mappingList.forEach(val => {
          this.allocationList.push({
            nebulaAllocation: val.serviceMappingId,
            content: val.description,
            version: val.version,
            status: val.status,
            confirmDelete2: false
          })
        })
      })
    },
    // 详情功能
    getMsgDetail (row, index) {
      this.dialogVisible = true
      const dataGmms = {
        serviceMappingId: row.nebulaAllocation
      }
      getMappingMessageService(dataGmms).then(res => {
        var data00 = res.data.body.content
        this.content = (JSON.parse(data00))
      })
    },
    // 创建发布
    createPublish (row) {
      var sendData2 = {
        selected: '1',
        pageMenu: '创建发布任务',
        productVersion: row.version,
        serviceMappingId: row.nebulaAllocation
      }
      sessionStorage.setItem('serviceMappingId', row.nebulaAllocation)
      this.$router.push({path: '/main/createPublish', query: sendData2})
    },
    // 手风琴切换
    toggleRowExpansion (row = null) {
      if (row === null) {
        return
      }
      this.expands = []
      this.expands.push(row.nebulaAllocation)
      this.versionTaskList = []
      const item = {
        serviceMappingId: row.nebulaAllocation
      }
      this.getUpgradeTaskFunc(item)
    },
    getUpgradeTaskFunc (data) {
      getMappingTaskListService(data).then(res => {
        this.versionTaskList = res.data.body.versionTaskList
        this.versionTaskList.forEach(res => {
          res.publishType = res.publishType === '2' ? '正式发布' : '灰度发布'
          res.taskStatus = res.taskStatus === '1' ? '发布中' : res.taskStatus === '2' ? '已结束' : '暂停'
          res.confirmDelete = false
          res.confirmDelete1 = false
        })
      })
    },
    // 增加配置项
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const vul = {
            serviceModuleId: this.$route.params.id,
            description: this.ruleForm2.desc,
            version: this.ruleForm2.version,
            content: this.ruleForm2.contentList
          }
          addMappingService(vul).then(res => {
            if (res.data.body.errorCode === '0') {
              this.Notification('成功', '创建成功')
              this.getMsgList(1, 10)
              this.dialogVisible1 = false
            } else {
              this.Notification('失败', '创建失败', 'error')
              this.dialogVisible1 = false
            }
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 增加配置弹框显示
    addClick () {
      this.dialogVisible1 = true
    },
    // 上传文件功能
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      var file = document.getElementById('file').files[0]
      const extension = file.name.split('.')[1] === 'txt'
      // console.log(extension)
      if (!extension) {
        this.$confirm('请上传文件只能是 txt 格式!', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'error'
        }).then()
      } else {
        this.createInput(files[0])
      }
    },
    // 读取上传文件
    createInput (file) {
      var reader = new FileReader()
      var vm = this
      reader.onload = (e) => {
        vm.ruleForm2.contentList = reader.result
        this.isJSON(vm.ruleForm2.contentList)
      }
      reader.readAsText(file)
    },
    // 判断文件内容
    isJSON (str) {
      try {
        JSON.stringify(str)
        if (str.indexOf('{') !== 0) {
          this.$confirm('请上传json对象格式配置内容!', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          }).then()
          return false
        } else {
          return true
        }
      } catch (e) {
        // console.log(e)
        return false
      }
    }
  }
}
</script>

