<template>
  <div class="pageReviewSettings">
    <div style="padding: 20px 20px 20px 30px; height: 72px;">
      <el-button size="small">重置</el-button>
      <div style="float: right;">
        <el-input size="small" v-model="filterText" placeholder="请输入交易名称" id="keyword" data-meta="[object Object]">
          <el-button slot="append" icon="el-icon-search" size="mini" @click = "search2"></el-button>
        </el-input> 
      </div>
    </div>
    <div class="app-narrow-table" style="padding: 0px 30px;">
      <el-table
        :data="tableNum"
        style="width: 100%;border-radius:5px"
        border>
        <el-table-column
          prop="bsnCode"
          label="交易编号">
        </el-table-column>
        <el-table-column
          prop="tranCode"
          label="接口编号">
        </el-table-column>
        <el-table-column
          prop="bsnName"
          label="交易名称">
        </el-table-column>
        <el-table-column
          prop="alias"
          label="	关联策略名称">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleScreen(scope.row)">
              {{scope.row.alias}}
            </el-button>
            <el-dialog title="策略详情" :visible.sync="gamedialogTableVisible" style="text-align:left;" width="75%">
              <h4 style="padding-bottom: 15px;">交易名称：新建用户</h4>
              <el-table
                :data="game"
                style="width: 100%;border-radius:5px"
                border>
                <el-table-column
                  prop="authId"
                  label="策略编号">
                </el-table-column>
                <el-table-column
                  prop="alias"
                  label="策略名称">
                </el-table-column>
                <el-table-column
                  prop="authType"
                  label="授权方式">
                </el-table-column>
                <el-table-column
                  prop="authDefine"
                  label="	授权定义"
                  >
                  <el-table-column
                    prop="grade1"
                    label="一级">
                  </el-table-column>
                  <el-table-column
                    prop="grade2"
                    label="二级">
                  </el-table-column>
                  <el-table-column
                    prop="grade3"
                    label="三级">
                  </el-table-column>
                  <el-table-column
                    prop="grade4"
                    label="四级">
                  </el-table-column>
                  <el-table-column
                    prop="grade5"
                    label="五级"
                    >
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div slot="footer" class="dialog-footer">
                <el-button @click="gamedialogTableVisible = false" size="small">退出</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column
          prop="keySet"
          label="	关联策略设置">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="setting(scope.row)">
              设置
            </el-button>
            <el-dialog title="设置策略" :visible.sync="relateddialogTableVisible" style="text-align:left" width="1000px">
              <h4 style="padding-bottom: 15px;">交易名称：新建用户</h4>
              <el-table
                :data="getAuthDefListService"
                style="width: 100%;border-radius:5px"
                border>
                <el-table-column
                  prop="authId"
                  label="策略编号">
                </el-table-column>
                <el-table-column
                  prop="alias"
                  label="策略名称">
                </el-table-column>
                <el-table-column
                  prop="authType"
                  label="授权方式">
                </el-table-column>
                <el-table-column
                  prop="authDefine"
                  label="	授权定义"
                  >
                  <el-table-column
                    prop="grade1"
                    label="一级"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="grade2"
                    label="二级"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="grade3"
                    label="三级"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="grade4"
                    label="四级"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="grade5"
                    label="五级"
                    width="120"
                    >
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="control"
                  label="	操作">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="setRel(scope.row)">
                      设置关联
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                background
                :page-sizes="[10, 20, 30, 40]"
                :page-size = "pageSize"
                layout="sizes, prev, pager, next"
                :total="turnPageTotalNum"
                style="text-align:right;padding:20px 0;">
              </el-pagination>
              <div slot="footer" class="dialog-footer">
                <el-button @click="relateddialogTableVisible = false" size="small">退出</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float:right;padding:20px 0">
        <el-pagination
          v-show="this.tableNum.length>0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size = "pageSize"
          layout="sizes, prev, pager, next"
          :total="parseFloat(turnPageTotalNum)">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style>
  /* div.el-dialog div.el-dialog__body{
    padding:20px 20px 20px 20px;
    border-bottom:1px solid #e9e9e9;
    border-top:1px solid #e9e9e9;
  }
  .el-table {
    font-size: 12px
  }
  .el-table td{
    padding:7px 0
  } */
</style>

<script>
import { getBsnList, getStrategyList, editRel, getRelDetail } from '~/config/api'
export default {
  name: 'relationList',
  beforeMount () {
    this.getList()
  },
  data () {
    return {
      bsnCode: '',
      arr: [],
      turnPageTotalNum: 1,
      pageSize: 10,
      currentPage: 1, /* 默认页数  */
      filterText: '',
      tableNum: [],
      gamedialogTableVisible: false,
      game: [],
      relateddialogTableVisible: false,
      getAuthDefListService: []
    }
  },
  methods: {
    getList () {
      const page = {
        currentPage: this.currentPage,
        turnPageShowNum: this.pageSize
      }
      getBsnList(page).then(res => {
        var bsnListAll = res.data.body
        this.turnPageTotalNum = Number(bsnListAll.turnPageTotalNum) // 总条数
        this.tableNum = bsnListAll.bsnList // 列表项
        // console.log(this.tableNum)
      })
      getStrategyList(page).then(res => {
        var strategy = res.data.body.authDefList
        this.turnPageTotalNum = parseInt(res.data.body.turnPageTotalNum)
        // console.log(this.turnPageTotalNum)
        this.getAuthDefListService = strategy
        for (var i = 0; i < strategy.length; i++) {
          if (strategy[i].authType === '0') {
            this.getAuthDefListService[i].authType = '无序'
          } else {
            this.getAuthDefListService[i].authType = '有序'
            // console.log(this.getAuthDefListService)
          }
          [this.getAuthDefListService[i].grade1, this.getAuthDefListService[i].grade2, this.getAuthDefListService[i].grade3, this.getAuthDefListService[i].grade4, this.getAuthDefListService[i].grade5] = this.getAuthDefListService[i].authDefine.split('')
        }
      })
    },
    search2 () { // 搜索交易名称
      if (this.filterText === '') {
        this.$message({
          message: '请输入关键字!',
          type: 'warning',
          center: true
        })
      } else {
        const searchName = {
          currentPage: this.currentPage,
          turnPageShowNum: this.pageSize,
          bsnName: this.filterText
        }
        getBsnList(searchName).then(res => {
          var bsnListAll = res.data.body
          this.turnPageTotalNum = Number(bsnListAll.turnPageTotalNum) // 总条数
          this.tableNum = bsnListAll.bsnList // 列表项
          // console.log(this.tableNum)
        })
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    },
    setting (row) {
      this.relateddialogTableVisible = true
      this.bsnCode = row.bsnCode
      // console.log(this.bsnCode)
    },
    setRel (row) {
      const rel = {
        authId: row.authId,
        bsnCode: this.bsnCode
      }
      editRel(rel).then(res => {
        if (res.data.body.errorCode === '0') {
          this.$notify({
            title: '成功',
            message: '关联成功',
            type: 'success'
          })
          this.getList()
          // console.log(res.data.body.errorCode)
        }
      })
    },
    handleScreen (row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.gamedialogTableVisible = true
      }, 300)
      const can = {
        currentPage: 1,
        authId: row.authId
      }
      // console.log(row)
      getRelDetail(can).then(res => {
        // console.log(res.data.body)
        this.game = [res.data.body]
        this.game[0].authType = res.data.body.authType === '0' ? '无序' : ''
        // console.log(this.game)
        this.game[0].grade1 = this.game[0].authDefine.split('')[0]
        this.game[0].grade2 = this.game[0].authDefine.split('')[1]
        this.game[0].grade3 = this.game[0].authDefine.split('')[2]
        this.game[0].grade4 = this.game[0].authDefine.split('')[3]
        this.game[0].grade5 = this.game[0].authDefine.split('')[4]
      })
    }
  }
}
</script>