<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px; line-height: 80px">
      <el-button type="primary" size="mini" @click="handleService('add')">+ 添加服务</el-button>
    </el-header>
    <!-- 服务表格 -->
    <el-main>
      <el-table
        :data="serverData"
        style="width: 100%"
        class="no-padding"
        :row-key="getKey"
        :expand-row-keys="expandRowKey"
        @current-change="handleExpand"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- 包表格 -->
            <el-table :data="moduleData[props.row.id]" style="width: 100%">
              <el-table-column prop="id" label="包id">
              </el-table-column>
              <el-table-column prop="name" label="包名称">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="goToModule(scope.row)">详情</el-button>
                  <el-button size="mini" type="text" @click="editModule('change', scope.row, props.row)">修改</el-button>
                  <el-popover placement="top" width="160" ref="popoverM{{$index}}" v-model="scope.row.confirmDelete">
                    <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
                    <div style="text-align: right">
                      <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="confirmEditModule(scope.row.id)">确定</el-button>
                    </div>
                  </el-popover>
                  <el-button size="mini" type="text" class="nomargin" v-popover:popoverM{{$index}}>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="服务id">
        </el-table-column>
        <el-table-column prop="name" label="服务名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.stop="editModule('add', {}, scope.row)">添加包</el-button>
            <el-button size="mini" type="text" @click.stop="handleService('change', scope.row)">修改</el-button>
            <el-popover placement="top" width="160" ref="popover{{$index}}" v-model="scope.row.confirmDelete">
              <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
              <div style="text-align: right">
                <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmDelete(scope.row.id)">确定</el-button>
              </div>
            </el-popover>
            <el-button size="mini" type="text" class="nomargin" v-popover:popover{{$index}} @click.stop>删除</el-button>
            <el-button type="primary" size="mini" @click.stop="handleNewConfig(scope.row.id)">配置发布</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer style="text-align: right">
      <el-pagination background layout="prev, pager, next" :total="10"></el-pagination>
    </el-footer>
    <!-- 修改&添加服务模态弹框 -->
    <el-dialog title="服务编辑" :visible.sync="serviceVisible" class="my-dialog" @close="closeService">
      <div style="width: 80%">
        <el-form :model="serviceInfo" :rules="serviceRules" label-width="150px" label-position="right" ref="serviceForm">
          <el-form-item label="服务id" v-if="handleServiceWay === 'change'" prop="id">
            <el-input v-model="serviceInfo.id" :disabled="handleServiceWay === 'change'"></el-input>
          </el-form-item>
          <el-form-item label="服务名称" prop="name">
            <el-input v-model="serviceInfo.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="serviceVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmChange('service', 'serviceForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改&添加包模态弹框 -->
    <el-dialog title="包编辑" :visible.sync="moduleVisible" class="my-dialog" @close="closeModule">
      <div style="width: 80%">
        <el-form :model="moduleInfo" :rules="moduleRules" label-width="150px" label-position="right" ref="moduleForm">
          <el-form-item label="服务id" v-if="handleModuleWay === 'add'" prop="serviceModuleId">
            <el-input v-model="moduleInfo.serviceModuleId" :disabled="handleModuleWay === 'add'"></el-input>
          </el-form-item>
          <el-form-item label="包id" v-if="handleModuleWay === 'change'" prop="zipModule">
            <el-input v-model="moduleInfo.zipModule" :disabled="handleModuleWay === 'change'"></el-input>
          </el-form-item>
          <el-form-item label="包名称" prop="moduleName">
            <el-input v-model="moduleInfo.moduleName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="moduleVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmChange('module', 'moduleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {
    queryService,
    queryNebulalistModuleList,
    editService,
    delService,
    submitModuleInfo,
    delModule
  } from '~/config/api'

  export default {
    data () {
      return {
        handleModuleWay: '',
        handleServiceWay: '',
        serviceVisible: false,
        moduleVisible: false,
        serverData: [],
        moduleData: {},
        getKey (row) {
          return row.id
        },
        expandRowKey: [],
        serviceInfo: {},
        moduleInfo: {},
        serviceRules: {
          id: [
            { required: true, message: '服务id不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '服务名称不能为空', trigger: 'blur' }
          ]
        },
        moduleRules: {
          serviceModuleId: [
            { required: true, message: '服务id不能为空', trigger: 'blur' }
          ],
          zipModule: [
            { required: true, message: '包id不能为空', trigger: 'blur' }
          ],
          moduleName: [
            { required: true, message: '包名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    // 获取服务数据进行渲染
    mounted () {
      this.getServiceData()
    },
    methods: {
      // 配置发布的路由跳转
      handleNewConfig (id) {
        this.$router.push({name: 'newConfig', params: {id}})
      },
      // 获取服务数据
      getServiceData () {
        this.serverData = []
        queryService().then(res => {
          const data = res.data.body.zipServiceList
          data.forEach(val => {
            this.serverData.push({
              id: val.serviceModuleId,
              name: val.serviceName,
              confirmDelete: false
            })
          })
        })
      },
      // 行展开时获取该服务下的包的数据
      handleExpand (row = null) {
        if (row === null) {
          return
        }
        this.expandRowKey = []
        this.expandRowKey.push(row.id)
        // if (!this.moduleData.hasOwnProperty(row.id)) 可以优化成只在第一次展开的时候才去后台查询数据，以及增删改查后
        this.moduleData[row.id] = []
        const data = {
          serviceModuleId: row.id
        }
        queryNebulalistModuleList(data).then(res => {
          const list = res.data.body.moduleList
          list.forEach(val => {
            this.moduleData[row.id].push({
              id: val.moduleId,
              name: val.moduleName,
              isNew: val.isNew,
              confirmDelete: false
            })
          })
        })
      },
      // 修改和添加服务
      handleService (type, row = {}) {
        this.handleServiceWay = type
        if (type === 'change') {
          this.serviceInfo = {
            id: row.id,
            name: row.name
          }
        }
        this.serviceVisible = true
      },
      // 确认添加/修改 服务/包根据
      confirmChange (type, formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            if (type === 'service') {
              this.serviceVisible = false
              let data = {
                serviceName: this.serviceInfo.name
              }
              if (this.handleServiceWay === 'change') {
                data.serviceModuleId = this.serviceInfo.id
              }
              editService(data).then(res => {
                this.handleMsg(res, '修改服务成功', '修改服务失败')
              }).then(setTimeout(() => { this.getServiceData() }, 100))
            } else if (type === 'module') {
              this.moduleVisible = false
              let data = {
                serviceModuleId: this.moduleInfo.serviceModuleId,
                moduleName: this.moduleInfo.moduleName
              }
              if (this.handleModuleWay === 'change') {
                data.zipModule = this.moduleInfo.zipModule
              }
              submitModuleInfo(data).then(res => {
                this.handleMsg(res, '修改包成功', '修改包失败')
              }).then(setTimeout(() => { this.getServiceData() }, 100))
            } else {
              throw new Error('Unknow Error!')
            }
          }
        })
      },
      // 确认删除服务
      confirmDelete (id) {
        this.serverData.confirmDelete = false
        const data = {
          serviceModuleId: id
        }
        delService(data).then(res => {
          this.handleMsg(res, '删除服务成功', '删除服务失败')
        }).then(setTimeout(() => { this.getServiceData() }, 100))
      },
      // 确认删除包
      confirmEditModule (id) {
        const data = {
          zipModule: id
        }
        delModule(data).then(res => {
          this.handleMsg(res, '删除包成功', '删除包失败')
        }).then(setTimeout(() => { this.getServiceData() }, 100))
      },
      // 关闭服务模态弹框的回调
      closeService () {
        this.serviceInfo = {}
        this.$refs.serviceForm.clearValidate()
      },
      // 跳转到离线包详情页
      goToModule (row) {
        this.$router.push({name: 'moduleMsg', params: { row: JSON.stringify(row) }})
      },
      // 添加/修改包信息
      editModule (type, row = {}, serviceRow = {}) {
        this.handleModuleWay = type
        if (type === 'change') {
          this.moduleInfo = {
            zipModule: row.id,
            moduleName: row.name
          }
        }
        this.moduleInfo.serviceModuleId = serviceRow.id
        this.moduleVisible = true
      },
      // 关闭包模态弹框的回调
      closeModule () {
        this.moduleInfo = {}
        this.$refs.moduleForm.clearValidate()
      },
      handleMsg (res, sucMsg, failMsg) {
        if (res.data.body.errorCode === '0') {
          this.$notify({
            title: '成功',
            message: sucMsg,
            duration: 2000,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: failMsg,
            duration: 2000,
            type: 'error'
          })
        }
      }
    }
  }
</script>