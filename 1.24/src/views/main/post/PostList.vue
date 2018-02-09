<template>
  <div class="pagePostManage">
    <el-container class="page-table">
        <!-- 一、新增按钮 -->
      <el-header>
        <el-button class="el-icon-plus" type="primary" size="mini" @click="addDialogFormVisible = true"> 新增岗位 </el-button>
      </el-header> 
      <!-- </el-header> -->
      <!-- 二、岗位列表 -->
      <el-main>
        <el-table :data="postList"  border v-loading="loading1">
          <el-table-column  prop="postId"  label="岗位编号" fixed></el-table-column>
          <el-table-column  prop="postName"  label="岗位名称"></el-table-column>
          <el-table-column  prop="updateTime"  label="更新时间"></el-table-column>
          <el-table-column  prop="remark"  label="备注"></el-table-column>
          <el-table-column  prop="state"  label="状态"></el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button @click="editPost(scope.row)" type="text" size="small">修改 </el-button> 
              <span class="divide">|</span>
              <el-popover placement="top" 
                          width="160" 
                          ref="popover{{$index}}"
                          v-model="scope.row.confirmDelete">
                <p class="povP"><i class="el-icon-warning"></i> 确认删除吗？</p>
                <div class="povD">
                  <el-button size="mini" @click="goBackBtn">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteRow(scope.row)">确定</el-button>
                </div>
              </el-popover>
              <el-button type="text" size="small" v-popover:popover{{$index}} @click="showTheRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="新增岗位" :visible.sync="addDialogFormVisible">
          <el-form :model="postForm" 
                    ref="postForm" 
                    :rules="postFormRules" 
                    label-width="100px" 
                    class="demo-dynamic">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="岗位名称:"
                              prop="postName"
                              id="postName">
                  <el-input type="roleName"  
                    placeholder="请输入岗位名称" 
                    v-model="postForm.postName" 
                    size="small">
                  </el-input>
                </el-form-item>  
                <el-form-item label="状态:"
                              prop="postState">
                  <el-radio-group v-model="postForm.state">
                    <el-radio label="1">可用</el-radio>
                    <el-radio label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>  
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="备注:"
                  prop="remark"
                  id="remark">
                  <el-input type="text" 
                            v-model="postForm.remark"
                            placeholder="请输入备注" 
                            auto-complete="false" 
                            size="small"></el-input>
                </el-form-item>  
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false" size="small">返回</el-button>
            <el-button @click="clearPostForm" size="small">清除</el-button>
            <el-button type="primary" @click="addPostSubmit" size="small">提交</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改岗位" :visible.sync="updateDialogFormVisible">
          <el-form :model="updatePostForm" 
                   ref="updatePostForm" 
                   :rules="updatePostFormRules" 
                   label-width="100px" 
                   class="demo-dynamic1">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="岗位名称:"  prop="postName"  id="postName">
                  <el-input type="text"  
                            placeholder="请输入岗位名称"
                            v-model="updatePostForm.postName" 
                            size="small">
                  </el-input>
                </el-form-item>  
                <el-form-item label="状态:"  prop="state">
                  <el-radio-group v-model="updatePostForm.state">
                    <el-radio label="可用"></el-radio>
                    <el-radio label="禁用"></el-radio>
                  </el-radio-group>
                </el-form-item>  
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="备注:"
                  id="remark">
                  <el-input type="text" 
                            v-model="updatePostForm.remark"
                            placeholder="请输入备注" 
                            auto-complete="false" 
                            size="small"></el-input>
                </el-form-item>  
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updateDialogFormVisible = false" size="small">返回</el-button>
            <el-button type="primary" @click="submitUpdate" size="small">提交</el-button>
          </div>
        </el-dialog>
      </el-main>
      <!-- 三、页码 -->
      <el-footer>
        <el-pagination
          v-show="postList.length>0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postListPage.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="postListPage.turnPageShowNum"
          layout="sizes, prev, pager, next"
          :total="parseInt(postListPage.total)">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getPostAllList, addPostList, updatePostList, delPostList } from '~/config/api'

export default {
  name: 'postList',
  data () {
    return {
      loading1: true,
      postList: [],
      postListPage: {
        currentPage: 1,
        turnPageShowNum: 10,
        total: ''
      },
      dialogTableVisible: false,
      addDialogFormVisible: false,
      dialogTableVisible1: false,
      updateDialogFormVisible: false,
      postForm: {
        postName: '',
        state: '1',
        remark: '',
        postDesc: ''
      },
      postFormRules: {
        postName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
        postState: [
          { required: true, message: '状态名不能为空', trigger: 'blur' }
        ]
      },
      updatePostFormRules: {
        postName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '状态名不能为空', trigger: 'blur' }
        ]
      },
      updatePostForm: {
        postName: '',
        postId: '',
        state: '',
        postDesc: '',
        remark: ''
      }
    }
  },
  beforeMount () {
    this.getPostListPageShow(1, 10)
  },
  methods: {
    // 获取岗位分页数据
    getPostListPageShow (currentPg, currentPgNum) {
      const sendItem = {
        currentPage: currentPg,
        turnPageShowNum: currentPgNum
      }
      this.loading1 = true
      getPostAllList(sendItem).then(res => {
        if (res.data.body.errorCode !== '') {
          var results = res.data.body.postList
          results.forEach(item => {
            item.state = item.state === '1' ? '可用' : '禁用'
            item.confirmDelete = false
          })
          this.postListPage.total = res.data.body.turnPageTotalNum
          this.postList = results
          this.loading1 = false
        }
      })
    },
    handleSizeChange (val) {
      this.postListPage.turnPageShowNum = val
      this.getPostListPageShow(this.postListPage.currentPage, val)
    },
    handleCurrentChange (val) {
      this.postListPage.currentPage = val
      this.getPostListPageShow(val, this.postListPage.turnPageShowNum)
    },
    Notification (title = '成功', message = '这是一条成功的提示消息', type = 'success', duration = 2000) {
      this.$notify({
        title: title,
        message: message,
        type: type,
        duration: duration
      })
    },
    // 新增岗位-清楚所有列
    clearPostForm () {
      this.postForm = []
    },
    // 新增岗位-提交
    addPostSubmit () {
      if (this.postForm.postName !== '') {
        addPostList(this.postForm).then(res => {
          if (res.data.body.errorCode === '0') {
            this.addDialogFormVisible = false
            this.Notification('成功', '恭喜新增岗位成功')
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择一个岗位',
          type: 'warning'
        })
      }
    },
    // 删除岗位
    deleteRow (row) {
      var sendItems = {
        postId: row.postId,
        postName: row.postName,
        state: row.state,
        remark: row.remark
      }
      delPostList(sendItems).then(res => {
        if (res.data.body.errorCode === '0') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          document.body.click()
          this.getPostListPageShow(1, 10)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showTheRow (row) {
      row.confirmDelete = true
    },
    goBackBtn () {
      document.body.click()
    },
    // 修改岗位
    editPost (row) {
      this.updatePostForm = row
      this.updateDialogFormVisible = true
    },
    // 提交修改
    submitUpdate () {
      var sendIt = {
        postName: this.updatePostForm.postName,
        postId: this.updatePostForm.postId,
        remark: this.updatePostForm.remark,
        state: this.updatePostForm.state === '可用' ? '1' : '0'
      }
      updatePostList(sendIt).then(res => {
        if (res.data.body.errorCode === '0') {
          this.updateDialogFormVisible = false
          this.Notification('成功', '恭喜修改岗位信息成功')
        }
      })
    }
  }
}
</script>
