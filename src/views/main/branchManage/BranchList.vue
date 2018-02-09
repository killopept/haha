<template>
  <div class="pageBranchManage">
    <div class="el-row">
      <div class="el-col-5">
        <div class="app-left-side">
          <div class="app-input-search">
            <el-input size="small" v-model="filterText" placeholder="请输入搜索机构名称" id="keyword" data-meta="[object Object]">
              <el-button slot="append" icon="el-icon-search" size="mini" @click="searchBrh"></el-button>
            </el-input>           
          </div>
          <div class="app-baranch-tree">
            <el-tree
              class="filter-tree"
              :data="totalTree"
              node-key="brhName"
              :props="defaultProps"
              default-expand-all:true
              highlight-current
              isShowCheckbox:true
              @node-click = "handleClick"
              style = 'padding:10px 5px'
              ref="tree2">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="el-col-19">
        <div class="app-form-scan">
          <div class="app-search-panel">
            <div class="button-group">
                <el-button size="mini" @click='resetBranch("branchList")' style="background:transparent;margin-right:10px">
                  重置修改
                </el-button>
                <el-button size="mini" style="margin-right:10px" @click="saveBranch('branchList')">
                  保存修改
                </el-button>
                <el-button type="primary" size="mini" @click="dialogFormVisible = true" style="margin-right:10px">
                  新增机构
                </el-button>
                <el-dialog title="增加机构" :visible.sync="dialogFormVisible" style="text-align:left;">
                  <el-form  :model="branchListAdd" :rules="check" ref="branchListAdd" label-width="100px" class="demo-branchListAdd">
                    <el-row>
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="23">
                            <el-form-item label="机构名称" prop="brhName" :rules="[{ required: true,message: ' '}]">
                              <el-input v-model="branchListAdd.brhName" size="small" placeholder="请输入机构名称"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="1"></el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="23">
                            <el-form-item label="联系人" prop="brhPerson" :rules="[{ required:false}]">
                              <el-input v-model="branchListAdd.brhPerson" size="small" placeholder="请填写联系人"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="1"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="23">
                            <el-form-item label="机构等级" prop="brhLevel" :rules="[{ required: true,message:' '}]">
                              <el-select v-model="branchListAdd.brhLevel" placeholder="请选择机构等级" size="small">
                                <el-option label="等级1" value="1"></el-option>
                                <el-option label="等级2" value="2"></el-option>
                                <el-option label="等级3" value="3"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="1"></el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="12">
                        <el-col :span="23">
                          <el-form-item label="联系电话" prop="brhPhone">
                            <el-input v-model="branchListAdd.brhPhone" size="small" placeholder="请输入联系电话"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-col :span="23">
                          <el-form-item label="机构描述" prop="brhDesc">
                            <el-input v-model="branchListAdd.brhDesc" size="small" placeholder="请输入机构描述"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-col>
                      <el-col :span="12">
                        <el-col :span="23">
                          <el-form-item label="地区编号" prop="brhRegionId">
                            <el-input v-model="branchListAdd.brhRegionId" size="small" placeholder="请输入地区编号"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-col :span="23">
                          <el-form-item label="机构地址" prop="brhAddress">
                            <el-input v-model="branchListAdd.brhAddress" size="small" placeholder="请输入地址"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-col>
                      <el-col :span="12">
                        <el-col :span="23">
                          <el-form-item label="所属机构" prop="brh" :rules="[{ required: false,message: ' '}]">
                            <el-cascader
                              :options="branchListBank"
                              placeholder="请选择机构"
                              :props="props"
                              :show-all-levels="false"
                              change-on-select
                              size="small"
                              clearable
                              v-model="branchListAdd.brh">
                            </el-cascader>
                          </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" size="small">返回</el-button>
                    <el-button @click="clearAll('branchListAdd')" size="small">清除所有</el-button>
                    <el-button type="primary" @click="addBranch('branchListAdd')" size="small">提交</el-button>
                  </div>
                </el-dialog>
                <el-button size="mini" id="del" style="margin-right:10px" @click = 'delForm("branchList")'>
                  删除机构
                </el-button>
            </div>
            <div class="BranchAdd"></div>
          </div>
          <el-form :model="branchList" ref="branchList" label-width="100px" class="demo-branchList">
            <el-row>
              <el-col :span="12">
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="机构编号" prop="brhId" :rules="[{ required: true,message: ' '}]">
                      <el-input v-model="branchList.brhId" size="small" disabled placeholder="请输入机构编号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6"></el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="机构名称" prop="brhName" :rules="[{ required: true,message: ' '}]">
                      <el-input v-model="branchList.brhName" size="small" placeholder="请输入机构"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6"></el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="联系人" prop="brhPerson">
                      <el-input v-model="branchList.brhPerson" size="small" placeholder="请输入用户描述"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6"></el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-col :span="18">
                  <el-form-item label="机构等级" prop="brhLevel" :rules="[{ required: true,message: ' '}]">
                    <el-select v-model="branchList.brhLevel" placeholder="请选择机构等级" size="small">
                      <el-option label="等级1" value="1"></el-option>
                      <el-option label="等级2" value="2"></el-option>
                      <el-option label="等级3" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-col :span="18">
                  <el-form-item label="联系电话" prop="brhPhone">
                    <el-input v-model="branchList.brhPhone" size="small" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-col>
              <el-col :span="12">
                <el-col :span="18">
                  <el-form-item label="机构描述" prop="brhDesc">
                    <el-input v-model="branchList.brhDesc" size="small" placeholder="请输入机构描述"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-col :span="18">
                  <el-form-item label="地区编号" prop="brhRegionId">
                    <el-input v-model="branchList.brhRegionId" size="small" placeholder="请输入地区编号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-col>
              <el-col :span="12">
                <el-col :span="18">
                  <el-form-item label="机构地址" prop="brhAddress">
                    <el-input v-model="branchList.brhAddress" size="small" placeholder="请输入地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-col :span="18">
                  <el-form-item label="所属机构" prop="brh" :rules="[{ required: false,message: ' '}]">
                    <el-cascader
                      :options="branchListBank"
                      v-model="branchList.brh"
                      placeholder="请选择机构"
                      :show-all-levels="false"
                      size="small"
                      clearable
                      change-on-select>
                    </el-cascader>
                    <!-- <button @click = "aa">aaaa</button> -->
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  /* input.el-input__inner{
    padding:0 7px;
  }
  .el-input--suffix .el-input__inner{
    padding-right:83px;
  }
  button#del{
    background:transparent
  }
  button#del{
    color:#f04134;
  }
  .el-button+.el-button{
    margin-left:0;
  }
  button#del:hover{
    color:#fff;
    background:#f04134;
    border:1px solid #f04134
  }
  span#primary div.el-dialog__header{
    text-align: start;
    border-bottom:1px solid #e9e9e9;
  }
  span#primary div.el-dialog__body{
    border-bottom: 1px solid #e9e9e9;
    padding:20px 20px;
  }
  span#primary div.el-dialog__footer{
    padding:15px;
  }
  div.el-dialog div.el-dialog__body{
    padding:20px 20px;
    border-bottom:1px solid #e9e9e9;
    border-top:1px solid #e9e9e9;
  }
  .el-tree-node__label {
    font-size: 12px;
  } */
</style>

<script>
  import { getBranchList, getBranchDetail, addBsnList, delBsnList, editBranch } from '~/config/api'
  export default {
    methods: {
      getAllbrhList () {
        getBranchList().then(res => { // 机构树
          var branchList = res.data.body.branchList
          var testArr = (msg) => {
            for (var m = 0; m < msg.length; m++) {
              msg[m].label = msg[m].brhName
              msg[m].value = msg[m].brhId
            }
            var parent = msg.filter((item) => item.brhParentId === '')
            var child = msg.filter((item) => item.brhParentId !== '')
            for (var i = 0; i < child.length; i++) {
              child[i].children = []
              for (var j = 0; j < child.length; j++) {
                if (child[i].brhId === child[j].brhParentId) {
                  child[i].children.push(child[j])
                }
              }
            }
            for (var n = 0; n < parent.length; n++) {
              parent[n].children = []
              for (var k = 0; k < child.length; k++) {
                if (parent[n].brhId === child[k].brhParentId) {
                  parent[n].children.push(child[k])
                }
              }
            }
            return parent
          }
          this.totalTree = testArr(branchList)
          this.branchListBank = testArr(branchList)
          // console.log(branchList)
          // console.log(this.branchListBank)
        })
      },
      // filter (value, data) {
      //   if (!value) return true
      //   console.log(data)
      //   return data.brhName.indexOf(value) !== -1
      // },
      searchBrh () {
        // this.$refs.tree2.filter(this.filterText)
        // console.log(this.totalTree)
        if (this.filterText === '') {
          this.$message({
            message: '请输入关键字!',
            type: 'warning',
            center: true
          })
        } else {
          this.$refs.tree2.setCurrentKey(this.filterText)
          const searchCan = {
            brhName: this.filterText
          }
          getBranchDetail(searchCan).then(res => { // 机构详情
            this.branchList = res.data.body
            var brhParentId = []
            brhParentId.push(this.branchList.brhParentId)
            this.branchList.brh = brhParentId
            this.saveBranchList = this.branchList
          })
        }
      },
      handleClick (data) {
        // console.log(data.children.length)
        // console.log(data)
        const DetailInfo = {
          brhId: data.brhid,
          brhName: data.brhName
        }
        getBranchDetail(DetailInfo).then(res => { // 机构详情
          this.branchList = res.data.body
          var brhParentId = []
          // if (data.children.length === 0)
          brhParentId.push(this.branchList.brhParentId)
          this.branchList.brh = brhParentId
          this.saveBranchList = this.branchList
          // console.log(this.saveBranchList)
          // console.log(this.branchListBank)
        })
      },
      resetBranch (formName) { // 重置修改
        // // this.$refs[formName].resetFields()
        // // this.branchList = this.saveBranchList
        // console.log(this.saveBranchList)
        // // console.log(this.branchList)
        const resetId = {
          brhId: this.$refs[formName].$el[0].value
        }
        getBranchDetail(resetId).then(res => { // 机构详情
          this.branchList = res.data.body
          this.branchList.brhParentName = []
        })
      },
      addBranch (formName) { // 提交新建机构
        if (!this.branchListAdd.brh) {
          this.branchListAdd.brhParentId = ''
        } else {
          this.branchListAdd.brhParentId = this.branchListAdd.brh[this.branchListAdd.brh.length - 1]
        }
        // console.log(this.branchListAdd.brhParentId)
        // console.log(this.branchListAdd.brh)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addBsnList(this.branchListAdd).then(res => {
              if (res.data.body.errorCode === '0') {
                // console.log(res)
                this.getAllbrhList()
                this.$notify({
                  title: '成功',
                  message: `恭喜！添加机构${this.branchListAdd.brhName} 成功`,
                  type: 'success'
                })
                this.dialogFormVisible = false
              }
            })
          } else {
            this.$message.error('填写内容错误请仔细填写')
          }
        })
        // console.log(this.branchListAdd)
      },
      clearAll (formName) {
        this.$refs[formName].resetFields()
      },
      saveBranch (formName) { // 保存修改
        const saveId = {
          brhId: this.$refs[formName].$el[0].value
        }
        if (saveId.brhId === '') {
          this.$message({
            message: '请选择一个机构节点',
            type: 'warning'
          })
        } else {
          this.$confirm('修改用户, 是否确认修改用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.branchList.brh) {
              this.branchList.brhParentId = ''
            } else {
              this.branchList.brhParentId = this.branchList.brh[this.branchList.brh.length - 1]
            }
            // console.log(this.branchList)
            editBranch(this.branchList).then(res => {
              // console.log(res)
              this.getAllbrhList()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      delForm (formName) { // 删除机构
        const delId = {
          brhId: this.$refs[formName].$el[0].value
        }
        // console.log(delId)
        if (delId.brhId === '') {
          this.$message({
            message: '请选择一个机构节点',
            type: 'warning'
          })
        } else {
          this.$confirm('删除用户, 是否确认删除用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delBsnList(delId).then(res => {
              if (res.data.body.errorCode === '0') {
                this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '删除成功!'
                })
                this.getAllbrhList()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    },
    beforeMount () {
      this.getAllbrhList()
    },
    data () {
      var checkPhone = (rule, value, callback) => { // 手机验证
        if (!value) {
          return callback(new Error('请输入有效的手机号码'))
        }
        setTimeout(() => {
          var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
          if (!myreg.test(value)) {
            callback(new Error('请输入有效的手机号码'))
          } else {
            callback()
          }
        }, 20)
      }
      return {
        filterText: '',
        totalTree: [],
        branchListBank: [],
        defaultProps: {
          children: 'children',
          label: 'brhName'
        },
        props: {
          value: 'brhId',
          children: 'children',
          label: 'brhName'
        },
        branchList: {}, // 机构列表详情
        saveBranchList: {},
        dialogFormVisible: false,
        branchListAdd: {
          brhAddress: '',
          brhDesc: '',
          brhLevel: '',
          brhName: '',
          brhParentId: '',
          brhPerson: '',
          brhPhone: '',
          brhRegionId: '',
          brhShortName: ''
        }, // 新增机构
        check: { // 机构手机验证
          brhPhone: [{ validator: checkPhone, trigger: 'blur', required: true }]
        },
        formLabelWidth: '120px'
      }
    }
  }
</script>