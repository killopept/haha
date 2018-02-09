<template>
  <div>
    <div style="padding: 20px 30px;">
      <div>
        <el-button type="primary" icon = 'el-icon-plus' size="mini" @click="addResource = true">添加资源</el-button>
        <el-dialog title="添加资源" :visible.sync="addResource" width="520px">
          <el-form :model="addResForm" ref="addResForm">
            <el-form-item label="资源类型:" prop='resourceType' :label-width="formLabelWidth" :rules="[{ required: true, message: ' '}]">
              <el-select v-model="addResForm.resourceType" size="small">
                <el-option :label="item" :value="item" v-for='item in resType' :key="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="平台类型:" prop='platform' :label-width="formLabelWidth" :rules="[{ required: true, message: ' '}]">
              <el-select v-model="addResForm.platform" size="small">
                <el-option :label="item" :value="item" v-for='item in platType' :key="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源名称:" prop="resourceName" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入资源名称'}]">
              <el-input v-model="addResForm.resourceName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="资源值:" prop="resourceValue" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入资源值'}]">
              <el-input v-model="addResForm.resourceValue" size="small"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addResource = false" size="small">取 消</el-button>
            <el-button type="primary" @click="subAddRes('addResForm')" size="small">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div style="padding-top: 20px;">
        <el-table
          :data="tableData"
          style="width: 100%;font-size:12px;font-weight:nomal">
          <el-table-column
            prop="resourceType"
            label="资源类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="platform"
            label="平台类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="resourceName"
            label="资源名称">
          </el-table-column>
          <el-table-column
            prop="resourceValue"
            label="资源值">
          </el-table-column>
          <el-table-column
            prop="control"
            label="操作">
            <template slot-scope="scope">
              <el-popover
                ref="delResRow{{$index}}"
                placement="top"
                width="160"
                v-model="scope.row.visible">
                <p style="margin-bottom:10px">确定要删除吗?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="confirm()">确定</el-button>
                </div>
              </el-popover>
              <el-button type="text" size="small" v-popover:delResRow{{$index}} @click="del(scope.row)" >删除</el-button>
              <el-button type="text" size="small" @click="update(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class = "page" style = "float:right;margin-top:16px">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1">
        </el-pagination>
      </div>
      <el-dialog title="修改资源" :visible.sync="updateRes" width="520px">
        <el-form :model="updateResForm" ref="updateResForm">
          <el-form-item label="资源类型:" prop='resourceType' :label-width="formLabelWidth" :rules="[{ required: true, message: ' '}]">
            <el-select v-model="updateResForm.resourceType" size="small">
              <el-option :label="item" :value="item" v-for='item in resType' :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台类型:" prop='platform' :label-width="formLabelWidth" :rules="[{ required: true, message: ' '}]">
            <el-select v-model="updateResForm.platform" size="small">
              <el-option :label="item" :value="item" v-for='item in platType' :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称:" prop="resourceName" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入资源名称'}]">
            <el-input v-model="updateResForm.resourceName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="资源值:" prop="resourceValue" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入资源值'}]">
            <el-input v-model="updateResForm.resourceValue" size="small"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateRes = false" size="small">取 消</el-button>
          <el-button type="primary" @click="subUpdateRes('updateResForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style>
  /* .el-table th {
    font-weight: normal;
  }
  .el-dialog__header span {
    font-size: 12px;
  }
  .el-dialog__body {
    padding-right: 90px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9
  }
  .el-form-item__label{
    font-size: 12px;
  } */
</style>

<script>
import { getRouList, addRes, updateResList, delResList } from '~/config/api'
export default {
  name: 'resourceManage',
  data () {
    return {
      tableData: [],
      addResource: false,
      updateRes: false,
      addResForm: {
        resourceType: '城市',
        platform: '平台无关',
        resourceName: '',
        resourceValue: ''
      }, // 增加资源配置
      updateResForm: { // 修改资源
        id: '',
        platform: '城市',
        resourceType: '平台无关',
        resourceName: '',
        resourceValue: '',
        msg: ''
      },
      formLabelWidth: '120px',
      resType: ['城市', '机型', '网络', 'osVersion'], // 源类型列表
      platType: ['平台无关', 'Android', 'IOS'], // 平台类型列表
      visible: false,
      rowId: '',
      delId: ''
    }
  },
  methods: {
    subAddRes (formName) { // 提交添加资源配置
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.addRes)
          addRes(this.addResForm).then(res => {
            if (res.data.body.errorCode === '0') {
              this.$notify({
                title: '成功',
                message: '添加资源成功',
                type: 'success'
              })
            }
            this.getResAllList()
            this.addResource = false
          })
        } else {
          return false
        }
      })
    },
    subUpdateRes (formName) { // 提交修改资源
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const can = {
            id: this.rowId,
            platform: this.updateResForm.platform,
            resourceType: this.updateResForm.resourceType,
            resourceValue: this.updateResForm.resourceValue,
            resourceName: this.updateResForm.resourceName
          }
          updateResList(can).then(res => {
            if (res.data.body.errorCode === '0') {
              this.$notify({
                title: '成功',
                message: '修改资源成功',
                type: 'success'
              })
              this.getResAllList()
              this.updateRes = false
            }
          })
        } else {
          return false
        }
      })
    },
    getResAllList () {
      getRouList().then(res => { // 获取资源配置列表
        this.tableData = res.data.body.resourceList
        for (var i = 0; i < this.tableData.length; i++) {
          var resT = this.tableData[i].resourceType
          if (resT === 'city') {
            this.tableData[i].resourceType = '城市'
          } else if (resT === 'version') {
            this.tableData[i].resourceType = '版本号'
          } else if (resT === 'mobileModel') {
            this.tableData[i].resourceType = '机型'
          } else if (resT === 'netType') {
            this.tableData[i].resourceType = '网络'
          }
        }
        for (var m = 0; m < this.tableData.length; m++) {
          var resP = this.tableData[m].platform
          if (resP === '0') {
            this.tableData[m].platform = '平台无关'
          } else if (resP === '1') {
            this.tableData[m].platform = 'Android'
          } else if (resP === '2') {
            this.tableData[m].platform = 'IOS'
          }
        }
      })
    },
    del (row) {
      this.delId = row.id
      this.visible = true
      // console.log(this.delId)
    },
    confirm () {
      for (var n = 0; n < this.tableData.length; n++) {
        this.tableData[n].visible = false
      }
      const idNum = {
        id: this.delId
      }
      delResList(idNum).then(res => {
        if (res.data.body.errorCode === '0') {
          this.$notify({
            title: '成功',
            message: '删除资源成功',
            type: 'success'
          })
          this.getResAllList()
        }
      })
    },
    update (row) {
      this.updateRes = true
      this.rowId = row.id
      // console.log(this.rowId)
    }
  },
  beforeMount () {
    this.getResAllList()
  }
}
</script>