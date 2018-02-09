<template>
  <div class="applyHistoryList">
     <el-container class="page-table">
      <!-- 一、新增按钮 -->
      <el-header>
        <el-row :gutter="24">
          <el-col :span="16"> 
            <el-button plain size="small" @click="resetBtn"> 重 置 </el-button>
          </el-col>
          <el-col :span="8" class="head-rt">
            <el-date-picker
              v-model="valueDate"
              id="datetime"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              default-value="2017-12-26"
              width="100%" size="small">
            </el-date-picker>
          </el-col>
        </el-row>
      </el-header>
      <!-- 二、岗位列表 -->
      <el-main>
        <el-table :data="pendHisList"
                  border
                  width= "100%">
          <el-table-column  prop="flowId"  label="申请流水号"></el-table-column>
          <el-table-column  prop="bsnCode"  label="交易编号"></el-table-column>
          <el-table-column  prop="bsnName"  label="交易名称">
            <template slot-scope="scope">
              <el-button prop="dialogFormVisible" @click="dialogDetailsDataBtn(scope.row)" type="text" size="small">
                {{scope.row.bsnName}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column  prop="authFlag"  label="授权结果"></el-table-column>
          <el-table-column  prop="applyDate"  label="更新日期"></el-table-column>
          <el-table-column label="驳回原因" prop="rejReason">
          </el-table-column>
        </el-table>
        <el-dialog title="交易详情" :visible.sync="dialogFormVisible">
          <table class="dialogDetails">
            <tr v-for="(dialog,index) in dialogDetailsData" :key="index">
              <td>{{dialog.detailLf}}:</td>
              <td>{{dialog.detailRt?dialog.detailRt:'暂无'}}</td>
            </tr>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small">关闭</el-button>
          </div>
        </el-dialog>
      </el-main>
      <!-- 三、分页按钮 -->
      <el-footer>
        <el-pagination
          background
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
import { getPenHisList } from '~/config/api'
export default {
  name: 'pendHistoryList',
  data () {
    return {
      pendHisList: [],
      currentPage: 1,
      pageNumber: 10,
      pageTotalNumber: '',
      dialogFormVisible: false,
      dialogDetailsData: [],
      rejectForm: {
        rejectReason: ''
      },
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
        this.checkPenHisListPageShow(1, 10)
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
    dialogDetailsDataBtn (row) {
      this.dialogDetailsData = row.flowDetail
      this.dialogFormVisible = true
    },
    // 切换每页个数
    handleSizeChange (val) {
      this.pageNumber = val
      this.checkPenHisListPageShow(this.currentPage, this.pageNumber)
    },
    // 切换页码
    handleCurrentChange (val) {
      this.currentPage = val
      this.checkPenHisListPageShow(this.currentPage, this.pageNumber)
    },
    // 重置按钮
    resetBtn () {
      this.checkPenHisListPageShow(1, 10)
      this.currentPage = 1
      this.valueDate = ''
    },
    // 页码数据
    checkPenHisListPageShow (currentPg, currentPgNum) {
      var item = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        currentPage: currentPg,
        turnPageShowNum: currentPgNum
      }
      // 审查列表
      getPenHisList(item).then(res => {
        this.pageTotalNumber = res.data.body.turnPageTotalNum
        var array = res.data.body.stateList
        for (var i = 0; i < array.length; i++) {
          var year = array[i].applyDate.slice(0, 4)
          var mon = array[i].applyDate.slice(4, 6)
          var date = array[i].applyDate.slice(6, 8)
          var hour = array[i].applyDate.slice(8, 10)
          var min = array[i].applyDate.slice(10, 12)
          array[i].applyDate = year + '/' + mon + '/' + date + ' ' + hour + ':' + min
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
        this.pendHisList = array
      })
    }
  },
  beforeMount () {
    this.checkPenHisListPageShow(1, 10)
  }
}
</script>