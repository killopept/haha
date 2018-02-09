<template>
  <div class="app-page-wrapper page-whiteListManage">
    <div style="padding: 20px 30px;">
      <!-- 添加白名单 -->
      <el-button type="primary" icon="el-icon-plus" size="mini" @click='dialogFormVisible = true'>添加白名单</el-button>
      <el-dialog title="添加白名单" :visible.sync="dialogFormVisible">
        <el-form :model="whiteListform" ref="whiteListform" size="medium">
          <el-form-item label="白名单名称" :label-width="formLabelWidth" prop="whiteListName" :rules="[{ required: true, message: '请输入白名单名称', trigger: 'blur' }]">
            <el-input v-model="whiteListform.whiteListName" auto-complete="off" style="width:50%;"></el-input>
          </el-form-item>
          <el-form-item label="业务类型" :label-width="formLabelWidth" prop="business" :rules="[{ required: true, message: '请输入业务类型', trigger: 'blur' }]">
            <el-select v-model="whiteListform.business">
              <el-option label="热修复" value="hotpatch"></el-option>
              <el-option label="升级" value="upgrade"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="白名单类型" :label-width="formLabelWidth" prop="idType" :rules="[{ required: true, message: '请输入白名单类型', trigger: 'blur' }]">
            <el-select v-model="whiteListform.idType">
              <el-option label="用户白名单" value="userid"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addList('whiteListform')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 白名单列表主体 -->
      <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="whiteListName" label="白名单名称"></el-table-column>
        <el-table-column prop="idType" label="白名单类型"></el-table-column>
        <el-table-column prop="business" label="业务类型"></el-table-column>
        <el-table-column prop="whiteListCount" label="白名单数量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="handleAdd(scope.row)" type="text" size="small">添加</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加白名单用户 -->
      <el-dialog title="添加白名单用户" :visible.sync="dialogForm">
        <el-form :model="userIdList" ref="userIdList" size="mini">
          <el-form-item label="userId列表" prop="keyIds" :rules="[{ required: true, message: '请输入userId', trigger: 'blur' }]">
            <el-input type="textarea" v-model="userIdList.keyIds"></el-input>
            <span style="color: red;">可输入多个userId，用英文(半角)逗号分隔</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="addListIds('userIdList')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { qryWhiteList, addWhiteList, deleteWhiteList, addWhiteListIds } from '~/config/api'

export default {
  name: 'whiteListManage',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      dialogForm: false,
      whiteListform: {
        whiteListName: '',
        business: 'hotpatch',
        idType: 'userid'
      },
      formLabelWidth: '120px',
      userIdList: {
        keyIds: '',
        idType: '',
        id: ''
      }
    }
  },
  mounted () {
    this.getWhiteList()
  },
  methods: {
    // 添加白名单
    addList (formName) {
      // console.log(formName)
      // console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          addWhiteList(this.whiteListform).then(res => {
            if (res.data.body.errorCode === '0') {
              this.$notify({
                message: '添加成功',
                type: 'success'
              })
              this.getWhiteList()
            } else {
              this.$notify.error({
                message: '添加失败'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 白名单列表获取
    getWhiteList () {
      qryWhiteList().then(res => {
        // console.dir(res.data.body.whiteList)
        this.tableData = res.data.body.whiteList
        // console.log(this.tableData)
      })
    },
    handleDel (row) {
      // console.log(row.id)
      this.$confirm('是否删除此条白名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var idList = {
          id: row.id.toString()
        }
        // 删除白名单
        deleteWhiteList(idList).then(res => {
          // console.log(res.data.body.msg)
          this.$message({
            type: 'success',
            message: res.data.body.msg
          })
          this.getWhiteList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleAdd (row) {
      this.dialogForm = true
      this.userIdList.id = row.id
      this.userIdList.idType = row.idType
    },
    // 添加白名单用户
    addListIds (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogForm = false
          addWhiteListIds(this.userIdList).then(res => {
            if (res.data.body.errorCode === '0') {
              this.$notify({
                message: '添加成功',
                type: 'success'
              })
              this.userIdList.id = ''
              this.userIdList.idType = ''
              this.userIdList.keyIds = ''
              this.getWhiteList()
            } else {
              this.$notify.error({
                message: '添加失败'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>


 