<template>
  <el-container v-loading="msgLoading">
    <el-header style="text-align: left; font-size: 12px; line-height: 80px">
      <el-button type="primary" size="mini" @click="handleTemplate('create')">创建新模板</el-button>
    </el-header>

    <el-main>
      <el-table :data="msgTemplate" style="100%">
        <el-table-column prop="name" label="模板名称" style="15%">
        </el-table-column>
        <el-table-column prop="describe" label="模板描述" style="25%">
        </el-table-column>
        <el-table-column prop="text" label="模板内容" style="25%">
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" style="20%">
        </el-table-column>
        <el-table-column label="操作" style="15%">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleTemplate('detail', scope.row)">详情</el-button>
            <el-popover placement="top" width="160" ref="popover{{$index}}" v-model="scope.row.confirmDelete">
              <p style="padding: 10px 10px 20px"><i class="el-icon-warning"></i> 确认删除吗？</p>
              <div style="text-align: right">
                <el-button size="mini" @click="scope.row.confirmDelete = false">取消</el-button>
                <el-button type="primary" size="mini" @click="delTemplate(scope.row.id)">确定</el-button>
              </div>
            </el-popover>
            <el-button size="mini" type="text" v-popover:popover{{$index}}>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer style="text-align: right">
      <el-pagination background layout="prev, pager, next" :total="templatePage.total"></el-pagination>
    </el-footer>
    <!-- 创建模板模态弹框 -->
    <el-dialog title="创建推送模板" :visible.sync="templateVisible" class="msg-template" @close="closeTemplate">
      <el-container>
        <el-header style="height: auto">
          <el-alert title="模板由模板主体，占位符，以及其它一些消息属性组成。不包含占位符的模板将不具有个性化消息的能力。
                           通过这种 #占位符名称# 写法来标识模板中的动态化部分，占位符可以出现在消息的标题、正文内容。"
                    type="warning"
                    :closable="false"
          ></el-alert>
        </el-header>
        <el-main style="width: 80%">
          <el-form :model="newTemplate" :rules="templateRules" label-width="150px" label-position="right" ref="templateForm">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="newTemplate.name" :disabled="handleTemplateWay === 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="模板描述" prop="describe">
              <el-input v-model="newTemplate.describe" :disabled="handleTemplateWay === 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="模板标题" prop="title">
              <el-input v-model="newTemplate.title" :disabled="handleTemplateWay === 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="模板正文" prop="text">
              <el-input v-model="newTemplate.text" :disabled="handleTemplateWay === 'detail'"></el-input>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button @click="templateVisible = false" size="mini" v-if="handleTemplateWay === 'create'">取 消</el-button>
        <el-button type="primary" @click="templateConfirm('templateForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {
    getMessageTemplateList,
    addMessageTemplate,
    delMessageTemplate
  } from '~/config/api'

  export default {
    data () {
      return {
        handleTemplateWay: '',
        templateVisible: false,
        templateRules: {
          name: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          describe: [
            { required: true, message: '请输入模板描述', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入模板标题', trigger: 'blur' }
          ],
          text: [
            { required: true, message: '请输入模板正文', trigger: 'blur' }
          ]
        },
        templatePage: {
          currentPage: 1,
          pageSize: 10,
          total: 10
        },
        msgTemplate: [],
        newTemplate: {
          name: '',
          describe: '',
          title: '',
          text: ''
        },
        msgLoading: false
      }
    },
    mounted () {
      this.getMsgTempList()
    },
    methods: {
      getMsgTempList () {
        this.msgLoading = true
        getMessageTemplateList().then(res => {
          const data = res.data.body
          // this.funcPage.total = parseInt(data.turnPageTotalNum)
          this.msgTemplate = []
          data.templateList.forEach(val => {
            this.msgTemplate.push({
              id: val.id,
              name: val.name,
              describe: val.descInfo,
              title: val.title,
              text: val.content,
              createTime: this.formatTime(val.gmtCreate),
              confirmDelete: false
            })
          })
          this.msgLoading = false
        })
      },
      handleTemplate (type, row = {}) {
        this.handleTemplateWay = type
        this.templateVisible = true
        if (type === 'detail') {
          this.newTemplate = row
        } else if (type === 'create') {
          this.newTemplate.type = 'create'
        }
      },
      templateConfirm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            if (this.newTemplate.hasOwnProperty('type')) {
              const data = {
                name: this.newTemplate.name,
                descInfo: this.newTemplate.describe,
                title: this.newTemplate.title,
                content: this.newTemplate.text
              }
              addMessageTemplate(data).then(res => {
                this.handleMsg(res, '添加成功', '添加失败')
              }).then(setTimeout(() => this.getMsgTempList(), 100))
            }
            this.templateVisible = false
          }
        })
      },
      delTemplate (id) {
        this.msgTemplate.confirmDelete = false
        const data = { id }
        delMessageTemplate(data).then(res => {
          this.handleMsg(res, '删除成功', '删除失败')
        }).then(setTimeout(() => this.getMsgTempList(), 100))
      },
      closeTemplate () {
        this.newTemplate = {
          name: '',
          describe: '',
          title: '',
          text: ''
        }
        this.$refs.templateForm.clearValidate()
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
      },
      formatTime (time) {
        return time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)
      }
    }
  }
</script>