<template>
  <el-container>

    <el-main>
      <el-table :data="messageList" style="100%">
        <el-table-column prop="title" label="通知标题" style="25%">
        </el-table-column>
        <el-table-column prop="createTime" label="推送时间" style="50%">
        </el-table-column>
        <el-table-column prop="targetUser" label="目标用户" style="25%">
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer style="text-align: right">
      <el-pagination background layout="total, sizes, prev, pager, next" 
                     :total="messagePage.total" 
                     :current-page.sync="messagePage.pageNo"
                     :page-size="messagePage.pageSize"
                     :page-sizes="[10, 20, 30, 40, 50]"
                     @current-change="switchPage"
                     @size-change="sizeChange"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
  import { queryMessageList } from '~/config/api'

  export default {
    data () {
      return {
        messagePage: {
          pageNo: 1,
          pageSize: 10,
          total: 10
        },
        messageList: []
      }
    },
    mounted () {
      this.getMsgList()
    },
    methods: {
      getMsgList () {
        queryMessageList(this.messagePage).then(res => {
          const data = res.data.body
          this.messagePage.total = parseInt(data.totalSize)
          this.messageList = []
          data.sourceMessageList.forEach(val => {
            this.messageList.push({
              title: val.title,
              createTime: this.formatTime(val.createTime),
              targetUser: this.formatUser(val.targetUser)
            })
          })
        })
      },
      formatTime (time) {
        return time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)
      },
      formatUser (user) {
        let targetUser = ''
        switch (user) {
          case '0':
            targetUser = '全部推送'
            break
          case '1':
            targetUser = '标签推送'
            break
          case '2':
            targetUser = '特定推送'
            break
        }
        return targetUser
      },
      switchPage () {
        this.getMsgList()
      },
      sizeChange (val) {
        this.messagePage.pageSize = val
        this.getMsgList()
      }
    }
  }
</script>