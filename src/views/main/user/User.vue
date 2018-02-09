<template>
  <div class="pageUserManage">
     <el-row>
       <div class="el-col-5">
         <div class="app-left-side">
           <div class="app-input-search">
            <el-input size="small" v-model="filterText" placeholder="请输入搜索机构名称" id="keyword" data-meta="[object Object]">
              <el-button slot="append" icon="el-icon-search" size="mini" @click="search1"></el-button>
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
              @node-click = "handleClick"
              style = 'padding:10px 5px'
              ref="userTree">
            </el-tree>
          </div>
         </div>
       </div>
       <div class="el-col-19">
         <div class="app-search-panel">
           <el-form :model="userForm" ref="userForm" label-width="100px">
             <el-row>
               <el-col :span="11">
                 <el-row>
                   <el-col :span="23">
                     <el-form-item label="用户编号:" prop="userNo" :rules="[{ required: false}]">
                      <el-input v-model="userForm.userNo" size="small" placeholder="请输入用户编号"></el-input>
                     </el-form-item> 
                   </el-col>
                   <el-col :span="1"></el-col>
                 </el-row>
               </el-col>
               <el-col :span="13">
                 <el-col :span="23">
                   <el-form-item label="用户名称:" prop="userName" :rules="[{ required: false}]">
                    <el-input v-model="userForm.userName" size="small" placeholder="请输入用户名称"></el-input>
                   </el-form-item> 
                 </el-col>
                 <el-col :span="1"></el-col>
               </el-col>
             </el-row>
             <el-row>
               <el-col :span="11">
                 <el-row>
                   <el-col :span="23" id="grade">
                    <el-form-item label="用户级别:" prop="userLevel" :rules="[{ required: false}]">
                      <el-select v-model="userForm.userLevel" placeholder=" " size="small">
                        <el-option label="等级1" value="1"></el-option>
                        <el-option label="等级2" value="2"></el-option>
                        <el-option label="等级3" value="3"></el-option>
                        <el-option label="等级4" value="4"></el-option>
                        <el-option label="等级5" value="5"></el-option>
                      </el-select>
                    </el-form-item>
                   </el-col>
                   <el-col :span="1"></el-col>
                 </el-row>
               </el-col>
               <el-col :span="13">
                 <el-col :span="23">
                   <el-form-item label="创建日期:" prop="createTime" :rules="[{ required: false}]">
                     <el-date-picker
                      v-model="userForm.createTime"
                      id="datetime"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      default-value="2017-12-01"
                      style="width:322px" size="small">
                    </el-date-picker>
                   </el-form-item>
                 </el-col>
                 <el-col :span="1">
                 </el-col>
               </el-col>
             </el-row>
           </el-form>
           <div class="button-group">
             <el-button plain size="small" style="margin-right:10px" @click = 'searchUser'>搜索用户</el-button>
             <el-button type="info" plain size="small" style="margin-right:10px" @click = 'clearUserInput("userForm")'>清除条件</el-button>
             <el-button type="primary" size="small" @click="createUser">新增用户</el-button>
             <el-dialog title="新增用户" :visible.sync="dialogFormVisible" style="text-align:left">
              <el-form :model="addFormUser" :rules="checkUser" label-width="100px" ref="addFormUser">
                <el-row>
                  <el-col :span="12">
                   <el-form-item label="用户姓名:" prop="userName" :rules="[{ required: true,message: '请输入用户名'}]">
                    <el-input size="small" placeholder="请输入用户姓名" v-model="addFormUser.userName"></el-input>
                   </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="登录用户:" prop="userLoginName" :rules="[{ required: true,message: ' '}]">
                      <el-input size="small" placeholder="请输入用户姓名" v-model="addFormUser.userLoginName"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                   <el-form-item label="登录密码:" prop="userPwd" :rules="[{ required: true,message: ' '}]">
                    <el-input size="small" type ="password" v-model="addFormUser.userPwd"></el-input>
                   </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户描述:" prop="userDesc" :rules="[{ required: false}]">
                      <el-input size="small" placeholder="请填写用户描述" v-model="addFormUser.userDesc"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                   <el-form-item label="邮箱地址:" prop="userEmail">
                    <el-input size="small" placeholder="请输入邮箱地址" v-model="addFormUser.userEmail"></el-input>
                   </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户住址:" prop="userAddress" :rules="[{ required: false}]">
                      <el-input size="small" placeholder="请填写用户住址" v-model="addFormUser.userAddress"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                   <el-form-item label="证件类型:" prop="userCertType" :rules="[{ required: true,message: '请输入证件类型'}]">
                    <el-select size="small" v-model="addFormUser.userCertType" placeholder="">
                      <el-option label="身份证" value="1"></el-option>
                      <el-option label="护照" value="2"></el-option>
                      <el-option label="港澳通行证" value="3"></el-option>
                    </el-select>
                   </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="证件号码:" prop="userCertNo">
                      <el-input size="small" placeholder="请输入证件号码" v-model="addFormUser.userCertNo"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="手机号码:" prop="userMobile">
                      <el-input size="small" placeholder="请输入手机号码" v-model="addFormUser.userMobile"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属机构:" prop="brh" :rules="[{ required: true,message: '请选择所属机构'}]">
                      <el-cascader
                        :options="branchListBank"
                        placeholder=" "
                        :show-all-levels="false"
                        change-on-select
                        :props="props"
                        v-model="addFormUser.brh">
                      </el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="岗位选择:" prop="postName" :rules="[{ required: false}]">
                      <el-select size="small" placeholder="" v-model="addFormUser.postId">
                        <el-option :label='item.postName' :value='item.postId' v-for='item in postUser' :key="item.key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户等级:" prop="userLevel" :rules="[{ required: true,message: '请选择用户等级'}]">
                      <el-select size="small" placeholder="" v-model="addFormUser.userLevel">
                        <el-option label="等级1" value="1"></el-option>
                        <el-option label="等级2" value="2"></el-option>
                        <el-option label="等级3" value="3"></el-option>
                        <el-option label="等级4" value="4"></el-option>
                        <el-option label="等级5" value="5"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="审批权限：" prop= "userRight" :rules="[{ required: true,message: ' '}]">
                      <el-radio-group v-model="addFormUser.userRight">
                        <el-radio label="00000100">有</el-radio>
                        <el-radio label="00000000">无</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" size="small">返回</el-button>
                <el-button @click="empty('addFormUser')" size="small">清除所有</el-button>
                <el-button type="primary" @click="submitUser('addFormUser')" size="small">提交</el-button>
              </div>
             </el-dialog>
           </div>
         </div>
         <div class="userQuery app-narrow-table" style="padding: 0px 20px;">
          <el-table
            :data="getUserListService"
            border
            style="width: 100%;font-size:12px">
            <el-table-column
              prop="userLoginName"
              label="登陆用户">
            </el-table-column>
            <el-table-column
              prop="userNo"
              label="用户编号">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户姓名">
            </el-table-column>
            <el-table-column
              prop="brhName"
              label="所属机构"
              width="120px">
            </el-table-column>
            <el-table-column
              prop="userLevel"
              label="用户级别">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="150px">
            </el-table-column>
            <el-table-column
              label="操作"
              width="220px">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click = 'update(scope.row)'>修改</el-button>
                |
                <el-button type="text" size="small" @click="cut(scope.row)">删除</el-button>
                |
                <el-button type="text" size="small" @click="showUserDetail(scope.row)">查看</el-button>
                |
                <el-button type="text" size="small" @click="bind(scope.row)">绑定角色</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="角色绑定" :visible.sync="bindialogFormVisible" style="text-align:left">
            <el-form :model="ruleFormBind" label-width="100px" ref = "ruleFormBind">
              <el-row>
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="18">
                  <el-form-item label="角色选择：" prop="roleComBox" :rules="{ required: true,message: ''}">
                      <el-tag
                        :key="tag"
                        v-for="tag in showBind"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                      >
                      </el-input>
                      <div>
                        <el-cascader
                          :options="roleListTree"
                          :props="roles"
                          class="button-new-tag"
                          :show-all-levels="false"
                          change-on-select
                          style="width:208px" clearable
                          v-model="ruleFormBind.roleComBox"
                          size="small"
                        ></el-cascader>
                      </div>
                  </el-form-item>
                </el-col>
                <el-col :span="3">&nbsp;</el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="bindialogFormVisible = false" size="small">返回</el-button>
              <el-button type="primary" @click="subUserBind('ruleFormBind')" size="small">提交</el-button>
            </div>
          </el-dialog>
          <el-dialog title="查看用户信息" :visible.sync="showFormUser" style="text-align:left">
            <el-form :model="userDetail" class="showUser" ref="userDetail">
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="用户姓名:" prop="userName">
                    {{userDetail.userName}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户邮箱:" prop="userEmail">
                    {{userDetail.userEmail}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="证件类型:" prop="userCertType">
                    {{userDetail.userCertType}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号码:" prop="userMobile">
                    {{userDetail.userMobile}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="岗位名称:" prop="postName ">
                    {{userDetail.postName}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="审批权限:" prop="userRight">
                    {{userDetail.userRight}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="角色绑定:" prop="roleList">
                    {{userDetail.roleList}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="登陆用户:" prop="userLoginName">
                    {{userDetail.userLoginName}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="用户描述:" prop="userDesc">
                    {{userDetail.userDesc}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户住址:" prop="userAddress">
                    {{userDetail.userAddress}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="证件号码:" prop="userCertNo">
                    {{userDetail.userCertNo}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属机构:" prop="brhName">
                    {{userDetail.brhName}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:left">
                <el-col :span="12">
                  <el-form-item label="用户等级:" prop="userLevel">
                    {{userDetail.userLevel}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="showFormUser = false" size="small">返回</el-button>
            </div>
          </el-dialog>
          <el-dialog title="修改用户信息" :visible.sync="updatedialogFormVisible" style="text-align:left">
            <el-form :model="ruleFormUpdate" :rules="checkUser" label-width="100px" ref = "ruleFormUpdate">
              <el-row>
                <el-col :span="12">
                <el-form-item label="用户姓名:" prop="userName" :rules="[{ required: true,message: ' '}]">
                  <el-input size="small" placeholder="请输入用户姓名" v-model="ruleFormUpdate.userName"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="登录用户:" prop="userLoginName" :rules="[{ required: true,message: ' '}]">
                    <el-input size="small" placeholder="请输入用户姓名" v-model="ruleFormUpdate.userLoginName"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                <el-form-item label="登录密码:" prop="userPwd" :rules="[{ required: true,message: ' '}]">
                  <el-input type="password" size="small" v-model="ruleFormUpdate.userPwd"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户描述:" prop="userDesc" :rules="[{ required: false}]">
                    <el-input size="small" placeholder="请填写用户描述" v-model="ruleFormUpdate.userDesc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                <el-form-item label="邮箱地址:" prop="userEmail">
                  <el-input size="small" placeholder="请输入邮箱地址" v-model="ruleFormUpdate.userEmail"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户住址:" prop="userAddress" :rules="[{ required: false}]">
                    <el-input size="small" placeholder="请填写用户住址" v-model="ruleFormUpdate.userAddress"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="证件类型:" prop="userCertType" :rules="[{ required: true,message: '请输入证件类型'}]">
                    <el-select size="small" v-model="ruleFormUpdate.userCertType" placeholder="">
                      <el-option label="身份证" value="1"></el-option>
                      <el-option label="护照" value="2"></el-option>
                      <el-option label="港澳通行证" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="证件号码:" prop="userCertNo">
                    <el-input size="small" placeholder="请输入证件号码" v-model="ruleFormUpdate.userCertNo"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手机号码:" prop="userMobile">
                    <el-input size="small" placeholder="请输入手机号码" v-model="ruleFormUpdate.userMobile"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属机构" prop="brh" :rules="[{ required: true,message: '请选择所属机构'}]">
                    <el-cascader
                      :options="branchListBank"
                      :show-all-levels="false"
                      change-on-select
                      :props="props"
                      v-model="ruleFormUpdate.brh">
                    </el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="岗位选择:" prop="postName" :rules="[{ required: false}]">
                    <el-select size="small" placeholder="" v-model="ruleFormUpdate.postName">
                      <el-option :label='item.postName' :value='item.postId' v-for='item in postUser' :key="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户等级:" prop="userLevel" :rules="[{ required: true,message: '请选择用户等级'}]">
                    <el-select size="small" placeholder="" v-model="ruleFormUpdate.userLevel">
                      <el-option label="等级1" value="1"></el-option>
                      <el-option label="等级2" value="2"></el-option>
                      <el-option label="等级3" value="3"></el-option>
                      <el-option label="等级4" value="4"></el-option>
                      <el-option label="等级5" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="审批权限：" prop="userRight" :rules="[{ required: true,message: ' '}]">
                    <el-radio-group v-model="ruleFormUpdate.userRight">
                      <el-radio label="00000100">有</el-radio>
                      <el-radio label="00000000">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="updatedialogFormVisible = false" size="small">返回</el-button>
              <el-button @click="updatedialogFormVisible = false" size="small">清除所有</el-button>
              <el-button type="primary" @click="updateUser('ruleFormUpdate')" size="small">提交</el-button>
            </div>
          </el-dialog>
          <div class="block" style="float:right;padding:20px 20px">
            <el-pagination
              v-show="this.getUserListService.length>0"
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
     </el-row>
  </div>
</template>
<style>
  /* .el-tree-node__label {
    font-size: 12px;
  }
  .el-table td{
    padding: 5px 0;
  }
  .el-table th{
    padding: 10px 0;
    background: #f7f7f7;
    font-weight: 500;
  }
  input.el-input__inner{
    padding:0 7px;
  }
  .el-input--suffix .el-input__inner{
    padding-right:80px;
  }
  #grade .el-input--suffix .el-input__inner {
    padding-right: 103px;
  }
  div.el-dialog span.el-dialog__title{
    font-size: 15px;
  }
  div.el-dialog div.el-dialog__body{
    padding:20px 20px;
    font-size:12px;
    border-bottom:1px solid #e9e9e9;
    border-top:1px solid #e9e9e9;
  }
  .el-button+.el-button{
    margin-left:0;
  }
  .showUser div.el-form-item{
    margin-bottom:0
  }
  .showUser .el-form-item__label{
    line-height: 25px;
    font-size: 12px;
  }
  .showUser .el-form-item__content{
    line-height:25px;
    font-size: 12px;
  } */
</style>

<script>
import { getBranchList, getUserList, getUserDetail, addUser, updateUser, delUser, getPostAllList, getAllRole, bindRole, createUserToRole } from '~/config/api'
export default {
  name: 'user',
  // watch: {
  //   filterText (val) {
  //     this.$refs.userTree.filter(val)
  //   }
  // },
  beforeMount () {
    this.userAllList()
  },
  methods: {
    userAllList () {
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
      getAllRole().then(res => { // 角色树
        var lis = res.data.body.roleList
        var testArr = (msg) => {
          for (var m = 0; m < msg.length; m++) {
            msg[m].label = msg[m].roleName
            msg[m].value = msg[m].roleName
          }
          var parent = msg.filter((item) => item.rolePId === '')
          var child = msg.filter((item) => item.rolePId !== '')
          for (var i = 0; i < child.length; i++) {
            child[i].children = []
            for (var j = 0; j < child.length; j++) {
              if (child[i].roleId === child[j].rolePId) {
                child[i].children.push(child[j])
              }
            }
          }
          for (var n = 0; n < parent.length; n++) {
            parent[n].children = []
            for (var k = 0; k < child.length; k++) {
              if (parent[n].roleId === child[k].rolePId) {
                parent[n].children.push(child[k])
              }
            }
          }
          return parent
        }
        this.roleListTree = testArr(lis)
        // console.log(this.roleListTree)
      })
      // const can = {
      //   currentPage: this.currentPage,
      //   turnPageShowNum: this.pageSize
      // }
      // getUserList(can).then(res => {
      //   var userList = res.data.body.userList
      //   this.turnPageTotalNum = userList.length
      //   // console.log(this.turnPageTotalNum)
      // })
      const sendItem = {
        currentPage: 1,
        turnPageShowNum: 10
      }
      getPostAllList(sendItem).then(res => {
        var results = res.data.body.postList
        for (var i = 0; i < results.length; i++) {
          if (results[i].state === '1') {
            results[i].state = '可用'
          } else {
            results[i].state = '禁用'
          }
        }
        this.postUser = results
      })
    },
    search1 () {
      if (this.filterText === '') {
        this.$message({
          message: '请输入关键字!',
          type: 'warning',
          center: true
        })
      } else {
        this.$refs.userTree.setCurrentKey(this.filterText)
        // console.log(this.$refs.userTree.getCurrentNode().brhId)
        const userPage = {
          brhId: this.$refs.userTree.getCurrentNode().brhId,
          currentPage: this.currentPage,
          turnPageShowNum: this.pageSize
        }
        getUserList(userPage).then(res => { // 获取机构所匹配的用户列表
          var userList = res.data.body.userList
          this.getUserListService = userList
          this.turnPageTotalNum = res.data.body.turnPageTotalNum
          // console.log(this.turnPageTotalNum)
          for (var t = 0; t < userList.length; t++) {
            var str = userList[t].createTime
            userList[t].createTime = str.slice(0, 4) + '/' + str.slice(4, 6) + '/' + str.slice(6, 8) + ' ' + str.slice(8, 10) + ':' + str.slice(10, 12)
          }
          // console.log(userList)
        })
      }
    },
    getAllUser (id) {
      function time (date) {
        var y = '' + date.getFullYear()
        var m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)
        var d = date.getDate() < 9 ? '0' + date.getDate() : '' + date.getDate()
        var createTime = y + m + d + '000000'
        return createTime
      }
      var search = ''
      if (this.userForm.createTime) {
        search = {
          brhId: id,
          userNo: this.userForm.userNo,
          userName: this.userForm.userName,
          userLevel: this.userForm.userLevel,
          beginTime: time(this.userForm.createTime[0]),
          endTime: time(this.userForm.createTime[1]),
          currentPage: this.currentPage,
          turnPageShowNum: this.pageSize
        }
      } else {
        search = {
          brhId: id,
          userNo: this.userForm.userNo,
          userName: this.userForm.userName,
          userLevel: this.userForm.userLevel,
          currentPage: this.currentPage,
          turnPageShowNum: this.pageSize
        }
      }
      getUserList(search).then(res => { // 搜索用户
        var userList = res.data.body.userList
        this.getUserListService = userList
        this.turnPageTotalNum = res.data.body.turnPageTotalNum
        // console.log(userList)
        for (var t = 0; t < userList.length; t++) {
          var str = userList[t].createTime
          userList[t].createTime = str.slice(0, 4) + '/' + str.slice(4, 6) + '/' + str.slice(6, 8) + ' ' + str.slice(8, 10) + ':' + str.slice(10, 12)
        }
        // console.log(userList)
        // console.log(res)
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClick (data) {
      // console.log(data)
      const userPage = {
        brhId: data.brhId,
        currentPage: 1,
        turnPageShowNum: 10
      }
      getUserList(userPage).then(res => { // 获取机构所匹配的用户列表
        var userList = res.data.body.userList
        this.getUserListService = userList
        this.turnPageTotalNum = res.data.body.turnPageTotalNum
        // console.log(this.turnPageTotalNum)
        for (var t = 0; t < userList.length; t++) {
          var str = userList[t].createTime
          userList[t].createTime = str.slice(0, 4) + '/' + str.slice(4, 6) + '/' + str.slice(6, 8) + ' ' + str.slice(8, 10) + ':' + str.slice(10, 12)
        }
        // console.log(userList)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getAllUser()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // console.log(val)
      this.getAllUser()
    },
    showUserDetail (row) { // 查看用户详情
      this.showFormUser = true
      const userNo = {
        userNo: row.userNo
      }
      getUserDetail(userNo).then(res => {
        this.userDetail = res.data.body
        var roleNameArr = this.userDetail.roleList
        // console.log(this.userDetail)
        var arrName = []
        this.userDetail.userCertType = this.userDetail.userCertType === '1' ? '身份证' : ''
        this.userDetail.userLevel = '等级' + this.userDetail.userLevel
        for (var i = 0; i < roleNameArr.length; i++) {
          arrName.push(roleNameArr[i].roleName)
        }
        this.userDetail.roleList = arrName.toString()
        if (this.userDetail.userRight === '00000100') {
          this.userDetail.userRight = '有'
        } else {
          this.userDetail.userRight = '无'
        }
      })
    },
    searchUser () {
      var id = ''
      this.getAllUser(id)
    },
    createUser () { // 添加用户
      this.dialogFormVisible = true
    },
    submitUser (formName) { // 提交添加用户
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addFormUser.brhId = this.addFormUser.brh[this.addFormUser.brh.length - 1]
          addUser(this.addFormUser).then(res => {
            if (res.data.body.errorCode === '0') {
              // console.log(res)
              this.$notify({
                title: '成功',
                message: `恭喜！添加用户成功`,
                type: 'success'
              })
              this.dialogFormVisible = false
            }
          })
        } else {
          this.$message.error('填写内容错误请仔细填写')
          // console.log(this.addFormUser)
        }
      })
    },
    empty (formName) { // 清空添加用户表
      this.$refs[formName].resetFields()
    },
    clearUserInput (formName) { // 清空搜索条件
      this.userForm.createTime = null
      this.$refs[formName].resetFields()
    },
    update (row) {
      this.updatedialogFormVisible = true
      const userNo = {
        userNo: row.userNo
      }
      getUserDetail(userNo).then(res => {
        this.ruleFormUpdate = res.data.body
        this.ruleFormUpdate.brh = [res.data.body.brhId]
        this.ruleFormUpdate.userPwd = '123456'
      })
    },
    updateUser (formName) { // 修改用户
      // console.log(this.ruleFormUpdate)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleFormUpdate.brhId = this.ruleFormUpdate.brh[this.ruleFormUpdate.brh.length - 1]
          updateUser(this.ruleFormUpdate).then(res => {
            if (res.data.body.errorCode === '0') {
              // console.log(res)
              this.$notify({
                title: '成功',
                message: `恭喜！修改用户成功`,
                type: 'success'
              })
              this.updatedialogFormVisible = false
              this.getAllUser()
            }
          })
        } else {
          this.$message.error('填写内容错误请仔细填写')
        }
      })
      // console.log(this.ruleFormUpdate)
    },
    cut (row) {
      // console.log(row)
      this.$confirm('删除用户, 是否确认删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delId = {
          userNo: row.userNo
        }
        delUser(delId).then(res => {
          if (res.data.body.errorCode === '0') {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '删除成功!'
            })
            this.getAllUser()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    bind (row) {
      this.bindialogFormVisible = true
      // console.log(row)
      const canRole = {
        userNo: row.userNo
      }
      this.createUserRole = {
        userNo: row.userNo,
        name: row.userName
      }
      // console.log(canRole)
      bindRole(canRole).then(res => {
        var role = res.data.body.userRoleRelList
        var UserBindRole = []
        for (var n = 0; n < role.length; n++) {
          if (role[n].state === '1') {
            UserBindRole.push(role[n].roleName)
          }
        }
        this.showBind = UserBindRole
      })
    },
    subUserBind (formName) { // 绑定角色
      this.bindialogFormVisible = false
      var roleC = this.ruleFormBind.roleComBox[this.ruleFormBind.roleComBox.length - 1]
      const roleCan = {
        roleList: [{'roleId': roleC, 'roleName': ''}],
        userNo: this.createUserRole.userNo,
        name: this.createUserRole.name
      }
      // console.log(this.ruleFormBind)
      // console.log(roleCan)
      createUserToRole(roleCan).then(res => {
        // console.log(res)
        if (res.data.body.errorCode === '0') {
          this.$notify({
            title: '成功',
            message: '绑定成功',
            type: 'success'
          })
        }
      })
      // console.log(roleCan)
    },
    handleClose (tag) {
      this.showBind.splice(this.showBind.indexOf(tag), 1)
      // console.log(tag)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.showBind.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  },
  data () {
    var checkMobile = (rule, value, callback) => { // 手机验证
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
    var checkEmail = (rule, value, callback) => { // 邮箱验证
      if (!value) {
        return callback(new Error('请输入邮箱地址'))
      }
      setTimeout(() => {
        var EmailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!EmailReg.test(value)) {
          callback(new Error('请输入有效的邮箱地址'))
        } else {
          callback()
        }
      }, 20)
    }
    var checkId = (rule, value, callback) => { // 身份证验证
      if (!value) {
        return callback(new Error('请输入邮箱地址'))
      }
      setTimeout(() => {
        var idReg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
        if (!idReg.test(value)) {
          callback(new Error('请输入证件号码'))
        } else {
          callback()
        }
      }, 20)
    }
    return {
      turnPageTotalNum: 1,
      currentPage: 1,
      pageSize: 10,
      postUser: [],
      filterText: '',
      totalTree: [],
      valueDate: '',
      userToRole: {},
      defaultProps: {
        children: 'children',
        label: 'brhName'
      },
      roles: {
        label: 'roleName',
        value: 'roleId',
        children: 'children'
      },
      userForm: {},
      getUserListService: [],
      userDetail: {},
      dialogFormVisible: false,
      updatedialogFormVisible: false,
      branchListBank: [],
      props: {
        value: 'brhId',
        children: 'children',
        label: 'brhName'
      },
      showFormUser: false,
      bindialogFormVisible: false,
      addFormUser: {
        postName: '',
        userPwd: '123456',
        userLoginName: 'admin',
        userName: '',
        userDesc: '',
        userPhone: '',
        userEmail: '',
        userAddress: '',
        userCertType: '',
        userCertNo: '',
        userMobile: '',
        userStt: '',
        userLevel: '',
        userRight: '00000100',
        userPwdSetDate: '',
        pubCenter: '',
        brhId: '',
        createTime: '',
        updateTime: '',
        postId: ''
      },
      checkUser: { // 用户手机验证
        userMobile: [{ validator: checkMobile, trigger: 'blur', required: true }], // 用户手机验证
        userEmail: [{ validator: checkEmail, trigger: 'blur', required: true }], // 用户邮箱验证
        userCertNo: [{ validator: checkId, trigger: 'blur', required: true }] // 用户身份证格式验证
      },
      ruleFormUpdate: {
        postName: '',
        userPwd: '',
        userLoginName: '',
        userName: '',
        userDesc: '',
        userPhone: '',
        userEmail: '',
        userAddress: '',
        userCertType: '',
        userCertNo: '',
        userMobile: '',
        userStt: '',
        userLevel: '',
        userRight: '',
        userPwdSetDate: '',
        pubCenter: '',
        brhId: '',
        createTime: '',
        updateTime: '',
        userNo: '',
        postId: ''
      },
      ruleFormBind: {
        roleComBox: []
      },
      formLabelWidth: '120px',
      showBind: [],
      inputVisible: false,
      inputValue: '',
      roleListTree: [],
      createUserRole: {}
    }
  }
}
</script>