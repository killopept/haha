<template>
  <div class="pageCheckList">
    <el-container class="page-table">
      <!-- // 审查列表 -->
      <el-main>
        <el-table :data="checkList"  border  width="100%" v-loading="loading1">
          <el-table-column  fixed  prop="applicantId"  label="审批流水号"></el-table-column>
          <el-table-column  prop="bsnCode"  label="交易编号"></el-table-column>
          <el-table-column  prop="bsnName"  label="交易名称">
            <template slot-scope="scope">
              <el-button @click="tradeDetailsBtn(scope.row)" type="text" size="small" >
                {{scope.row.bsnName}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column  prop="applicantId"  label="申请人编号"></el-table-column>
          <el-table-column  prop="applicantName"  label="申请人姓名"></el-table-column>
          <el-table-column  prop="updateDate"  label="更新日期"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="checkOperateBtn(scope.row,'0')" type="text" size="small">同意 </el-button>
              <span class="divide">|</span>
              <el-button type="text" size="small" @click="checkOperateBtn(scope.row,'1')">驳回</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="交易详情" :visible.sync="dialogFormVisible" class="dialog-form">
          <table class="tradeDetails">
            <tr v-for="(trad,index) in tradeDetailsData" :key="index">
              <td>{{trad.detailLf}}:</td>
              <td>{{trad.detailRt?trad.detailRt:'暂无'}}</td>
            </tr>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small">返回</el-button>
          </div>
        </el-dialog>
        <el-dialog title="同意审批" :visible.sync="agreeFormVisible">
          <table class="agreeDetails">
            <tr>
              <td>审批流水号:</td>
              <td> {{checkOperate.flowId}}</td>
            </tr>
            <tr>
              <td>交易名称:</td>
              <td> {{checkOperate.bsnName}}</td>
            </tr>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="agreeFormVisible = false">返回</el-button>
            <el-button type="primary" size="small" @click="confirmOperateDetails">确认</el-button>
          </div>
        </el-dialog>
        <el-dialog title="驳回审批" :visible.sync="rejectFormVisible">
          <table class="rejectDetails">
            <tr>
              <td>审批流水号: </td>
              <td> {{checkOperate.flowId}}</td>
            </tr>
            <tr>
              <td>交易名称: </td>
              <td> {{checkOperate.bsnName}}</td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form :model="rejectForm" ref="rejectForm" label-width="100px" class="demo-dynamic1">
                  <el-form-item label="驳回理由:"
                                prop="rejectReason"
                                :rules="{ required: true, message: '请填写驳回理由', trigger: 'blur' }">
                      <el-input v-model="rejectForm.rejectReason" size="small"></el-input>
                  </el-form-item>  
                </el-form>
              </td>
            </tr>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="rejectFormVisible = false">返回</el-button>
            <el-button type="primary" size="small" @click="confirmOperateDetails('rejectForm')">确认</el-button>
          </div>
        </el-dialog>
      </el-main>
      <!-- // 页码 -->
      <el-footer>
        <el-pagination
          background
          v-show="checkList.length>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageNumber"
          layout="sizes, prev, pager, next"
          :total='parseInt(pageTotalNumber)'>
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getCheckList, setCheckOperate } from '~/config/api'

export default {
  name: 'checkList',
  data () {
    return {
      loading1: true,
      checkList: [],
      currentPage: 1,
      currentPage1: 1,
      pageNumber: 10,
      pageTotalNumber: '',
      dialogFormVisible: false,
      agreeFormVisible: false,
      rejectFormVisible: false,
      tradeDetailsData: [],
      checkOperate: {},
      rejectForm: {
        rejectReason: ''
      }
    }
  },
  watch: {
    rejectFormVisible (val) {
      if (val === false) {
        this.$refs['rejectForm'].resetFields()
      }
    }
  },
  methods: {
    Notify (title = '成功', message = '这是一条成功的提示消息', type = 'success', duration = 2000) {
      this.$notify({
        title: title,
        message: message,
        type: type,
        duration: duration
      })
    },
    // 每页显示条数
    handleSizeChange (val) {
      this.pageNumber = val
      this.checkListPageShow(this.currentPage, this.pageNumber)
    },
    // 显示当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.checkListPageShow(this.currentPage, this.pageNumber)
    },
    // 审批提交 通过\驳回
    confirmOperateDetails (formName) {
      this.checkOperate.rejReason = this.rejectForm.rejectReason
      if (this.checkOperate.authFlag === '1') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            setCheckOperate(this.checkOperate).then(res => {
              this.rejectFormVisible = false
              if (res.data.body.errorCode === '0') {
                this.Notify('成功', `审批提交成功`)
              } else {
                this.Notify('失败', 'error', `审批提交失败`)
              }
            }).then(() => {
              this.checkListPageShow(1, 10)
            })
          } else {
            this.open('请先选择一个角色！')
            return false
          }
        })
      } else {
        setCheckOperate(this.checkOperate).then(res => {
          this.agreeFormVisible = false
          if (res.data.body.errorCode === '0') {
            this.Notify('成功', `审批提交成功`)
          } else {
            this.Notify('失败', 'error', `审批提交失败`)
          }
        }).then(() => {
          this.checkListPageShow(1, 10)
        })
      }
    },
    // 操作按钮点击弹出框
    checkOperateBtn (row, isAgree) {
      if (isAgree === '1') {
        this.rejectFormVisible = true
      } else {
        this.agreeFormVisible = true
      }
      this.checkOperate = row
      this.checkOperate.authFlag = isAgree
    },
    // 交易详情弹出款
    tradeDetailsBtn (row) {
      this.tradeDetailsData = row.flowDetail.slice(1)
      this.dialogFormVisible = true
    },
    // 页码数据
    checkListPageShow (currentPg, currentPgNum) {
      var item = {
        currentPage: currentPg,
        turnPageShowNum: currentPgNum
      }
      this.loading1 = true
      // 审查列表
      getCheckList(item).then(res => {
        if (res.data.body.errorCode !== '') {
          this.pageTotalNumber = res.data.body.turnPageTotalNum
          var array = res.data.body.pendList
          for (var i = 0; i < array.length; i++) {
            var year = array[i].updateDate.slice(0, 4)
            var mon = array[i].updateDate.slice(4, 6)
            var date = array[i].updateDate.slice(6, 8)
            var hour = array[i].updateDate.slice(8, 10)
            var min = array[i].updateDate.slice(10, 12)
            array[i].updateDate = year + '/' + mon + '/' + date + ' ' + hour + ':' + min
            var arr = array[i].flowDetail.split(',')
            var newArr = [i]
            arr.forEach(item => {
              newArr.push({
                detailLf: item.split('=')[0],
                detailRt: item.split('=')[1]
              })
            })
            array[i].flowDetail = newArr
          }
          this.checkList = array
          this.loading1 = false
        }
      })
    }
  },
  beforeMount () {
    this.checkListPageShow(1, 10)
  }
}
</script>