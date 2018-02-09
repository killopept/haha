<template>
<div class="pageRoleManage">
  <el-row :gutter="24">
    <!-- 一、角色管理左侧导航 -->
    <el-col :span="5">
      <div class="app-left-side">
        <!-- 1、搜索框 -->
        <div class="app-input-search">
          <el-input placeholder="请输入角色名称" v-model="inputRole" size="small">
            <el-button slot="append"
                        icon="el-icon-search" 
                        size="mini"
                        @click="open('请输入搜索关键字')"></el-button>
          </el-input>
        </div>
        <!-- 2、tree树形控件 -->
        <div class="app-barnch-tree">
          <el-tree class="filter-tree" 
                  :data="roleListTree" 
                  ref="tree2"
                  node-key="roleName"
                  :props="defaultProps"
                  default-expand-all:true
                  highlight-current
                  @node-click="handleNodeClick">
          </el-tree>
        </div>
      </div>
    </el-col>
    <!-- 二、角色管理右侧表单及呈现 -->
    <el-col :span="19">
      <!-- 1、搜索控件 -->
      <div class="app-search-panel">
        <!-- 1.1表单 -->  
        <el-form :model="roleValidateForm" ref="roleValidateForm" label-width="100px" class="demo-dynamic">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="角色名:"
                            prop="roleName"
                            :rules="{ required: true, message: '请输入角色名'}">
                <el-input type="text"  placeholder="请输入角色名" v-model="roleValidateForm.roleName" size="small"></el-input>
              </el-form-item>  
              <el-form-item label="状态:"
                            prop="roleStatus"
                            :rules="[
                              { required: true, message: '请输入状态名'}
                            ]">
                 <el-select v-model="roleValidateForm.roleStatus" size="small" placeholder="请选择状态" width="100%">
                  <el-option label="可用" value='1'></el-option>
                  <el-option label="禁用" value='0'></el-option>
                </el-select>
              </el-form-item>  
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色描述:" 
                            prop="roleDesc"
                            id="roleDesc">
                <el-input type="text" 
                          v-model="roleValidateForm.roleDesc"
                          placeholder="请输入角色描述" 
                          auto-complete="false" 
                          size="small"></el-input>
              </el-form-item>  
              <el-form-item label="所属角色:"
                            prop="roleComBox"> 
                <el-cascader
                  :options="roleListTree"
                  :props="props"
                  :show-all-levels="false"
                  change-on-select clearable
                  size="small"
                  v-model="roleValidateForm.roleComBox"
                ></el-cascader>
              </el-form-item>  
            </el-col>
          </el-row>
        </el-form>
        <!-- 1.2按钮组 -->
        <div class="button-group">
          <!-- 修改按钮 -->
          <span>
            <el-button size="small" @click="onSubmit">保存修改</el-button>
          </span>
          <!-- 关联按钮 -->
          <span>
            <el-button type="info" size="small" plain @click="bindRole('roleValidateForm')">关联功能</el-button>
            <el-dialog title="关联功能" :visible.sync="bindDialogVisivle">
              <el-table
                ref="multipleTable"
                :data="roleMenuList"
                tooltip-effect="dark"
                border width="100%"
                @select="handleSelectionChange">
                <el-table-column  type="selection"  width="55"></el-table-column>
                <el-table-column  label="菜单名称"  width="270">
                  <template slot-scope="scope">{{ scope.row.menuName }}</template>
                </el-table-column>
                <el-table-column  prop="menuItemName"  label="功能名称"></el-table-column>
              </el-table>
              <div class="bind-foot">
                <el-pagination
                  v-show="roleMenuList.length>0"
                  background
                  @current-change="handleCurrentListChange"
                  :current-page.sync="roleMenuItemPage.currentPage"
                  :page-size="roleMenuItemPage.turnPageShowNum"
                  layout="prev, pager, next, jumper"
                  :total="parseInt(roleMenuItemPage.total)">
                </el-pagination>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="bindDialogVisivle = false">返 回</el-button>
                <el-button size="small" type="primary" @click="submitSelection()">保 存</el-button>
              </div>
            </el-dialog>
          </span>
          <!-- 添加按钮 -->
          <span>
             <el-button type="primary" size="small" @click="dialogFormVisible = true">添加角色</el-button>
             <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
              <el-form :model="roleAddForm" ref="roleAddForm" :rules="roleAddFormRules" label-width="100px" class="demo-dynamic1">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="角色名:" prop="roleName">
                      <el-input type="text"  placeholder="请输入角色名" v-model="roleAddForm.roleName" size="small"></el-input>
                    </el-form-item>  
                    <el-form-item label="状态:"
                                  :rules="[{ required: true, message: '请输入状态名'}]">
                      <el-select v-model="roleAddForm.roleStatus" size="small" placeholder="请选择状态">
                        <el-option key='1' label="可用" value='1'></el-option>
                        <el-option key='2' label="禁用" value='0'></el-option>
                      </el-select>
                    </el-form-item>  
                  </el-col>
                  <el-col :span="12">
                    <el-form-item 
                      label="角色描述:">
                      <el-input type="text" 
                                v-model="roleAddForm.roleDesc"
                                placeholder="请输入角色描述" 
                                auto-complete="false" 
                                size="small"></el-input>
                    </el-form-item>  
                    <el-form-item label="所属角色:" prop="roleComBox">  
                        <el-cascader
                        :options="roleListTree"
                        :props="props"
                        :show-all-levels="false"
                        change-on-select
                        v-model="roleAddForm.roleComBox"  clearable
                        size="small"
                      ></el-cascader>
                    </el-form-item>  
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="small" @click="clearAllRoleAddForm('roleAddForm')">清除所有</el-button>
                <el-button size="small" type="primary" @click="addRole('roleAddForm')">确 定</el-button>
              </div>
            </el-dialog>
          </span>
          <!-- 删除按钮 -->
          <span>
            <el-button type="danger" size="small" plain  @click="deleteRole">删除角色</el-button>
          </span>
        </div>
      </div>
      <!-- 2、表格数据 -->
      <div class="app-narrow-table">
        <el-table  :data="roleMenuTable"  border  width="100%">
          <el-table-column  prop="menuName"  label="菜单名称"></el-table-column>
          <el-table-column  prop="menuItemName" label="功能名称"></el-table-column>
        </el-table>
        <el-footer>
          <el-pagination
            v-show="roleMenuTable.length>0"
            background
            @current-change="handleCurrentChange"
            :current-page.sync="roleMenuTablePage.currentPage"
            :page-size="roleMenuTablePage.turnPageShowNum"
            layout="prev, pager, next, jumper"
            :total="parseInt(roleMenuTablePage.total)">
          </el-pagination>
        </el-footer>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { getAllRole, getRoleItem, setRoleUpdate, addRole, delRole, getRoleMenuItemRelList, setRoleBindItem } from '~/config/api'

export default {
  name: 'role',
  data () {
    return {
      roleListTree: [],
      inputRole: '',
      defaultProps: {
        children: 'children',
        label: 'roleName'
      },
      props: {
        label: 'roleName',
        value: 'roleId',
        children: 'children'
      },
      roleValidateForm: {
        roleDesc: '',
        roleEndDate: '',
        roleId: '',
        roleName: '',
        roleOrder: '',
        rolePId: '',
        roleStatus: '',
        roleType: '',
        roleComBox: []
      },
      roleAddForm: {
        roleName: '',
        roleDesc: '',
        roleStatus: '1',
        rolePId: '',
        roleEndDate: '',
        roleOrder: '',
        roleComBox: []
      },
      roleAddFormRules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      },
      // 角色与菜单关联
      roleMenuList: [],
      roleMenuItemPage: {
        currentPage: 1,
        turnPageShowNum: 8,
        total: ''
      },
      roleMenuBindList: [],
      // 角色关联表格
      roleMenuTable: [],
      roleMenuTablePage: {
        currentPage: 1,
        turnPageShowNum: 8,
        total: ''
      },
      // 角色关联功能提交数据
      roleMenuItemRelList: [],
      dialogFormVisible: false,
      bindDialogVisivle: false,
      pageNum: [1], // 接收点击过的页面
      totalMenuPage: '',
      totalMenuPageList: [], // 接收当前页选择的item
      List: [] // 接收每页数据
    }
  },
  watch: {
    bindDialogVisivle (val) {
      if (val === false) {
        this.pageNum = [1]
        this.roleMenuItemPage.currentPage = 1
      }
    }
  },
  methods: {
    // 所有角色
    getAllRoleList () {
      getAllRole().then(res => {
        var lis = res.data.body.roleList
        var testArr = (msg) => {
          // for (var m = 0; m < msg.length; m++) {
          //   msg[m].label = msg[m].roleName
          //   msg[m].value = msg[m].roleName
          // }
          var parent = msg.filter((item) => item.rolePId === '')
          var child = msg.filter((item) => item.rolePId !== '')
          var child2 = msg.filter((item) => item.rolePId !== '')
          for (let i = 0; i < child.length; i++) {
            child[i].roleComBox = []
            child[i].children = []
            child[i].roleComBox.push(child[i].rolePId)
            for (let j = 0; j < child2.length; j++) {
              child2[j].roleComBox = []
              child2[j].roleComBox.unshift(child2[j].rolePId)
              if (child[i].roleId === child2[j].rolePId) {
                child2[j].roleComBox.unshift(...child[i].roleComBox)
                child[i].children.push(child2[j])
              }
            }
          }
          for (var n = 0; n < parent.length; n++) {
            parent[n].children = []
            parent[n].roleComBox = []
            for (var k = 0; k < child.length; k++) {
              if (parent[n].roleId === child[k].rolePId) {
                parent[n].children.push(child[k])
              }
            }
          }
          return parent
        }
        this.roleListTree = testArr(lis)
        function tree (arr) {
          arr.forEach(val => {
            if (val.children.length > 0) {
              tree(val.children)
            } else {
              delete val.children
            }
          })
        }
        tree(this.roleListTree)
      })
    },
    // 页码数据
    checkPenHisListPageShow (currentPg, currentPgNum, pageState) {
      setTimeout(() => {
        var item = {
          roleId: this.roleValidateForm.roleId,
          roleName: this.roleValidateForm.roleName,
          state: pageState,
          currentPage: currentPg,
          turnPageShowNum: currentPgNum
        }
        // 角色与功能关联- 关联\分页
        getRoleMenuItemRelList(item).then(res => {
          if (pageState === 1) {
            // 显示绑定表格
            this.roleMenuTable = res.data.body.roleMenuItemRelList
            // 显示已绑定 勾选
            this.roleMenuBindList = res.data.body.roleMenuItemRelList
            this.roleMenuTablePage.total = res.data.body.turnPageTotalNum
          } else if (pageState === '') {
            // 显示绑定页面可选项
            this.roleMenuItemPage.total = res.data.body.turnPageTotalNum
            this.totalMenuPage = res.data.body.turnPageTotalNum
            this.roleMenuList = res.data.body.roleMenuItemRelList
          }
        })
      }, 200)
    },
    // 左侧tree导航点击
    handleNodeClick (data) {
      var item = {
        roleName: data.roleName
      }
      // 角色详情
      getRoleItem(item).then(res => {
        this.roleValidateForm = res.data.body
        this.roleValidateForm.roleComBox = data.roleComBox
      })
      // 不分页
      this.checkPenHisListPageShow('1', 8, 2)
      // 分页 绑定功能
      this.checkPenHisListPageShow('1', 8, 1)
      // 不分页 所有绑定功能
      this.checkPenHisListPageShow('1', 8, '')
    },
    // 切换页码-表格
    handleCurrentChange (val) {
      this.roleMenuTablePage.currentPage = val
      this.checkPenHisListPageShow(val, 8, 1)
    },
    // 关联功能按钮
    bindRole (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.bindDialogVisivle = true
          var item1 = {
            roleId: this.roleValidateForm.roleId,
            roleName: this.roleValidateForm.roleName,
            state: '',
            currentPage: 1,
            turnPageShowNum: this.totalMenuPage
          }
          // 角色与功能关联- 关联\分页
          getRoleMenuItemRelList(item1).then(res => {
            this.totalMenuPageList = res.data.body.roleMenuItemRelList
          }).then(() => {
            for (var i = 0; i < Math.ceil(this.roleMenuItemPage.total / this.roleMenuItemPage.turnPageShowNum); i++) {
              this.List.push(this.totalMenuPageList.slice(i * 8, (i + 1) * 8))
            }
          })
          setTimeout(() => {
            this.roleMenuList.forEach(val => {
              this.$refs.multipleTable.toggleRowSelection(val, val.relStatus === '1')
            })
          }, 20)
        } else {
          this.open('请选择一个角色！')
          return false
        }
      })
    },
    // 切换页码-关联功能
    handleCurrentListChange (page) {
      var key = ''
      this.pageNum.forEach(item => {
        if (page === item) {
          key = 1
        }
      })
      this.pageNum.push(page)
      var _this = this
      var timer = ''
      this.roleMenuItemPage.currentPage = page
      if (key === 1) {
        this.roleMenuList = []
        new Promise((resolve, reject) => {
          this.roleMenuList.unshift(...this.List[page - 1])
        }).then(
          timer = setTimeout(() => {
            _this.roleMenuList.forEach(val => {
              _this.$refs.multipleTable.toggleRowSelection(val, val.relStatus === '1')
            })
            clearTimeout(timer)
          }, 360)
        )
      } else {
        new Promise((resolve, reject) => {
          this.checkPenHisListPageShow(page, 8, '')
        }).then(
          timer = setTimeout(() => {
            _this.roleMenuList.forEach(val => {
              _this.$refs.multipleTable.toggleRowSelection(val, val.relStatus === '1')
            })
            clearTimeout(timer)
          }, 360)
        )
      }
    },
    // 角色关联功能数据勾选
    handleSelectionChange (val, row) {
      if (row.relStatus === '') {
        row.relStatus = '1'
      } else {
        row.relStatus = ''
      }
      this.List[this.roleMenuItemPage.currentPage - 1] = []
      this.List[this.roleMenuItemPage.currentPage - 1].unshift(...this.roleMenuList)
    },
    // 保存角色绑定
    submitSelection () {
      var roleMenuLists = []
      var _this = this
      function getList () {
        _this.List.forEach(vals => {
          vals.forEach(val => {
            if (val.relStatus === '1') {
              roleMenuLists.push(val)
            }
          })
        })
      }
      getList()
      var toggleRoleItem = {
        roleId: _this.roleValidateForm.roleId,
        roleMenuItemRelList: roleMenuLists
      }
      setRoleBindItem(toggleRoleItem).then(res => {
        if (res.data.body.errorCode === '0') {
          _this.checkPenHisListPageShow('1', 8, 1)
          _this.Notify('成功', `恭喜！角色关联功能成功`)
        } else {
          _this.Notify('失败', `抱歉！角色关联功能失败`, 'error')
        }
        _this.bindDialogVisivle = false
      })
    },
    // 清除角色新增表单数据
    clearAllRoleAddForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 修改角色
    onSubmit () {
      if (this.roleValidateForm.roleName !== '') {
        if (this.roleValidateForm.roleComBox !== undefined) {
          this.roleValidateForm.rolePId = this.roleValidateForm.roleComBox[this.roleValidateForm.roleComBox.length - 1]
        }
        setRoleUpdate(this.roleValidateForm).then(res => {
          if (res.data.body.errorCode === '0') {
            this.Notify('成功', `恭喜！更新角色'${this.roleValidateForm.roleName}' 成功`)
            this.getAllRoleList()
          } else {
            this.Notify('失败', `抱歉！更新角色'${this.roleValidateForm.roleName}' 失败`)
          }
        })
      } else {
        this.open('请先选择一个角色')
      }
    },
    // 删除角色
    deleteRole () {
      if (this.roleValidateForm.roleName !== '') {
        this.$confirm('确认删除角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRole(this.roleValidateForm).then(res => {
            if (res.data.body.errorCode === '0') {
              this.Notify('成功', `恭喜！删除角色 ${this.roleValidateForm.roleName} 成功`)
              this.getAllRoleList()
            }
          })
        }).catch(() => {
          this.Notify('失败', `抱歉！删除角色 ${this.roleValidateForm.roleName} 失败`, 'error')
        })
      } else {
        this.open('请选择一个角色')
      }
    },
    // 增加角色
    addRole (formName) {
      this.roleAddForm.rolePId = this.roleAddForm.roleComBox[this.roleAddForm.roleComBox.length - 1]
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addRole(this.roleAddForm).then(res => {
            if (res.data.body.errorCode === '0') {
              this.Notify('成功', `恭喜！添加角色'${this.roleAddForm.roleName}' 成功`)
              this.getAllRoleList()
              this.dialogFormVisible = false
            } else {
              this.Notify('失败', `抱歉！添加角色'${this.roleAddForm.roleName}' 失败`)
            }
          }).then(() => {
            this.roleAddForm.roleName = ''
            this.roleAddForm.roleDesc = ''
            this.roleAddForm.roleStatus = '1'
            this.roleAddForm.rolePId = ''
            this.roleAddForm.roleComBox = []
          })
        } else {
          this.open('请先选择一个角色')
          return false
        }
      })
    },
    open (msg) {
      if (this.inputRole === '') {
        this.$message({
          showClose: true,
          message: msg,
          type: 'warning'
        })
      } else {
        this.$refs.tree2.setCurrentKey(this.inputRole)
        const searchCan = {
          roleName: this.inputRole
        }
        this.handleNodeClick(searchCan)
      }
    },
    Notify (title = '成功', message = '这是一条成功的提示消息', type = 'success', duration = '3000') {
      this.$notify({
        title: title,
        message: message,
        type: type,
        duration: duration
      })
    }
  },
  beforeMount () {
    this.getAllRoleList()
  }
}
</script>