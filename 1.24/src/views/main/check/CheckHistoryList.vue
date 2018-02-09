<template>
  <div class="checkHistoryList">
     <el-container class="page-table">
      <!-- 一、新增按钮 -->
      <el-header style="position:relative;">
        <el-button plain size="small" @click="resetBtn" text-align="left"> 重 置 </el-button>
        <el-date-picker v-model="valueDate"
                        id="datetime"
                        style="position:absolute;right:30px;top:50%;"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        default-value="2017-12-26"
                        width="100%" size="small">
        </el-date-picker>
      </el-header>
      <!-- 二、岗位列表 -->
      <el-main>
        <el-table :data="checkHistoryList"  border  width= "100%" v-loading="loading1">
          <el-table-column  prop="hisId"  label="授权流水号"></el-table-column>
          <el-table-column  prop="flowId"  label="审批流水号"></el-table-column>
          <el-table-column  prop="bsnCode"  label="交易编号"></el-table-column>
          <el-table-column  prop="bsnName"  label="交易名称">
            <template slot-scope="scope">
              <el-button @click="dialogDetailsDataBtn(scope.row)" type="text" size="small">
                {{scope.row.bsnName}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column  prop="cstNo"  label="授权人编号"></el-table-column>
          <el-table-column  prop="cstName"  label="授权人姓名"></el-table-column>
          <el-table-column  prop="authFlag"  label="授权结果"></el-table-column>
          <el-table-column  prop="authTime"  label="更新日期"></el-table-column>
          <el-table-column label="驳回原因" prop="rejReason"></el-table-column>
        </el-table>
        <el-dialog class="dialog-detail" 
                  title="交易详情" 
                  :visible.sync="dialogFormVisible">
          <table class="dialogDetails">
            <tr v-for="(dialog,index) in dialogDetailsData" :key="index">
              <td>{{dialog.detailLf}}:</td>
              <td>{{dialog.detailRt?dialog.detailRt:'暂无'}}</td>
            </tr>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small">返回</el-button>
          </div>
        </el-dialog>
      </el-main>
      <!-- 三、分页按钮 -->
      <el-footer>
        <el-pagination 
          background
          v-show="checkHistoryList.length>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageNumber"
          layout="sizes, prev, pager, next"
          :total="parseInt(pageTotalNumber)">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getCheckHistoryList } from '~/config/api'

export default {
  name: 'checkHistoryList',
  data () {
    return {
      checkHistoryList: [],
      currentPage: 1,
      pageNumber: 10,
      pageTotalNumber: '',
      dialogFormVisible: false,
      dialogDetailsData: [],
      valueDate: '',
      beginTime: '',
      endTime: ''
    }
  },
  watch: {
    // 根据日期查找数据
    valueDate (msg) {
      if (msg) {
        var beginT = msg[0].toLocaleDateString().split('/')
        var endT = msg[1].toLocaleDateString().split('/')
        this.beginTime = this.dateToString(beginT)
        this.endTime = this.dateToString(endT)
        this.checkHistoryListPageShow(1, 10)
        this.currentPage = 1
      }
    }
  },
  methods: {
    // 日期转换为 YYMMDD
    dateToString (date) {
      var timeString = ''
      for (var i = 0; i < date.length; i++) {
        if (date[i].length < 2) {
          date[i] = '0' + date[i]
        }
        timeString += date[i]
      }
      return timeString
    },
    handleSizeChange (val) {
      this.pageNumber = val
      this.checkHistoryListPageShow(this.currentPage, this.pageNumber)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.checkHistoryListPageShow(this.currentPage, this.pageNumber)
    },
    // 页码数据
    checkHistoryListPageShow (currentPg, currentPgNum) {
      var item = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        currentPage: currentPg,
        turnPageShowNum: currentPgNum
      }
      this.loading1 = true
      // 审查列表
      getCheckHistoryList(item).then(res => {
        this.pageTotalNumber = res.data.body.turnPageTotalNum
        var array = res.data.body.hisList
        for (var i = 0; i < array.length; i++) {
          var year = array[i].authTime.slice(0, 4)
          var mon = array[i].authTime.slice(4, 6)
          var date = array[i].authTime.slice(6, 8)
          var hour = array[i].authTime.slice(8, 10)
          var min = array[i].authTime.slice(10, 12)
          array[i].authTime = year + '/' + mon + '/' + date + ' ' + hour + ':' + min
          if (array[i].authFlag === '1') {
            array[i].authFlag = '驳回'
          } else {
            array[i].authFlag = '同意'
          }
          var arr = array[i].flowDetail.split(',')
          var newArr = []
          arr.forEach(item => {
            newArr.push({
              detailLf: item.split('=')[0],
              detailRt: item.split('=')[1]
            })
          })
          array[i].flowDetail = newArr
        }
        this.checkHistoryList = array
        this.loading1 = false
      })
    },
    // 交易详情弹出框
    dialogDetailsDataBtn (row) {
      this.dialogDetailsData = row.flowDetail
      this.dialogFormVisible = true
    },
    // 重置按钮
    resetBtn () {
      this.checkHistoryListPageShow(1, 10)
      this.currentPage = 1
      this.valueDate = ''
    }
  },
  beforeMount () {
    this.checkHistoryListPageShow(1, 10)
  }
}
</script>