<template>
  <el-form label-position="right" size="small" label-width="150px" :model="msgForm" :rules="msgRules" ref="msgForm" class="YouMeng">
    <el-form-item label="消息描述" prop="title">
      <el-input placeholder="用于标识信息，方便管理和查找" v-model="msgForm.title"></el-input>
    </el-form-item>
    <el-form-item label="自定参数">
      <el-input type="textarea" placeholder="传递消息命令代码" v-model="msgForm.extra"></el-input>
    </el-form-item>
    <el-form-item label="目标用户" prop="targetUser">
      <el-radio-group v-model="msgForm.targetUser">
        <el-radio-button label="0">全部用户</el-radio-button>
        <el-radio-button label="1">标签用户</el-radio-button>
        <el-radio-button label="2">特殊用户</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="应用标签" v-if="msgForm.targetUser === '1'" prop="tag">
      <el-select v-model="msgForm.tag" multiple placeholder="请选择应用标签">
        <el-option
          v-for="item in multiMedia"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上传CID文件"  v-if="msgForm.targetUser === '2'">
      <el-upload :action="uploadUrl" :on-success="uploadFile">
        <el-button icon="el-icon-upload2">点击上传</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="推送时间">
      <el-radio-group v-model="msgForm.time">
        <el-radio label="immediately">即时</el-radio>
        <el-radio label="timing">定时</el-radio>
        <el-date-picker
          v-model="msgForm.sendTime"
          v-if="msgForm.time === 'timing'"
          type="datetime"
          placeholder="选择日期时间"
          class="left-margin"
          value-format="yyyyMMddHHmmss"
        ></el-date-picker>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="目标平台">
      <el-radio-group v-model="msgForm.targetOs">
        <el-radio label="1">Android</el-radio>
        <el-radio label="2">ios</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标题" prop="minorTitle">
      <el-input v-model="msgForm.minorTitle"></el-input>
    </el-form-item>
    <el-form-item label="副标题" v-if="msgForm.targetOs === '2'" prop="subtitle">
      <el-input v-model="msgForm.subtitle"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="body">
      <el-input type="textarea" v-model="msgForm.body"></el-input>
    </el-form-item>
    <el-form-item label="角标" v-if="msgForm.targetOs === '2'">
      <el-input v-model="msgForm.badge"></el-input>
    </el-form-item>
    <div v-if="msgForm.targetOs === '1'">
      <el-form-item label="后续动作">
        <el-radio-group v-model="msgForm.after_open">
          <el-radio label="go_app">打开应用</el-radio>
          <el-radio label="go_url">打开链接</el-radio>
          <el-radio label="go_activity">打开指定页面</el-radio>
          <el-radio label="go_custom">自定义行为</el-radio>
        </el-radio-group>
        <el-input placeholder="请填写以httos或http开头的URL地址" v-if="msgForm.after_open === 'go_url'" v-model="msgForm.url"></el-input>
        <el-input placeholder="请填写完整的包名和Activity名字" v-if="msgForm.after_open === 'go_activity'" v-model="msgForm.activity"></el-input>
        <el-input type="textarea" 
                  placeholder="消息送达后，此处内容将传递应用自己解析和后续处理"
                  v-if="msgForm.after_open === 'go_custom'"
                  v-model="msgForm.custom"></el-input>
      </el-form-item>
      <el-form-item label="提醒方式">
        <el-checkbox v-model="msgForm.play_sound">声音</el-checkbox>
        <el-checkbox v-model="msgForm.play_vibrate">震动</el-checkbox>
        <el-checkbox v-model="msgForm.play_lights">呼吸灯</el-checkbox>
      </el-form-item>
      <el-form-item label="高级规制">
        <el-checkbox-group v-model="advincedRule">
          <el-checkbox label=0>限制发送速度</el-checkbox>
          <span style="font-size: 0.8rem" v-if="advincedRule[0] === '0'">
            <el-input-number v-model="msgForm.max_send_num" 
                            controls-position="right" 
                            :min="1000" 
                            :max="10000" 
                            class="left-margin"
            ></el-input-number>
            条/秒，最大10000
          </span>
        </el-checkbox-group>
      </el-form-item>
    </div>
    <el-form-item size="large">
      <el-button type="primary" @click="submit('msgForm')">确定</el-button>
      <!-- <el-button>重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
  import { sendNewMessage, API } from '~/config/api'

  export default {
    data () {
      return {
        uploadUrl: API.uploadCidFile,
        advincedRule: [],
        multiMedia: [{
          label: '图片',
          value: 'pic'
        }, {
          label: '音频',
          value: 'music'
        }, {
          label: '视频',
          value: 'vedio'
        }],
        msgForm: {
          fileId: '',
          time: 'immediately',
          title: '',
          extra: '',
          targetUser: '0',
          tag: [],
          targetOs: '1',
          sendTime: '',
          minorTitle: '',
          subtitle: '',
          body: '',
          badge: '',
          after_open: 'go_app',
          url: '',
          play_vibrate: true,
          play_lights: true,
          play_sound: true,
          max_send_num: 1000
        },
        msgRules: {
          title: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          targetUser: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          tag: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          minorTitle: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          subtitle: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          body: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sendNewMsg(this.msgForm)
          } else {
            return false
          }
        })
      },
      sendNewMsg (data) {
        let body = {
          title: data.minorTitle,
          text: data.body,
          after_open: data.after_open,
          play_vibrate: data.play_vibrate,
          play_lights: data.play_lights,
          play_sound: data.play_sound
        }
        const aps = {
          alert: {
            title: data.minorTitle,
            subtitle: data.subtitle,
            body: data.body
          },
          badge: data.badge
        }
        const payload = {
          extra: data.extra
        }
        if (data.targetOs === '1') {
          payload.body = body
          payload.policy = { max_send_num: data.max_send_num }
        } else {
          payload.aps = aps
        }
        let targetUserInfo = {
          targetOs: data.targetOs,
          tag: data.tag.join(',')
        }
        body = {
          appId: '1000000002',
          channel: '02',
          sendTime: data.time === 'immediately' ? '0' : data.sendTime,
          systemId: '0001',
          targetUser: data.targetUser,
          targetUserInfo: JSON.stringify(targetUserInfo),
          templateInfo0: JSON.stringify(payload),
          title: data.title
        }
        if (data.targetUser === '2') {
          body.fileId = data.fileId
        }
        sendNewMessage(body).then(res => {
          this.handleMsg(res, '消息创建成功', '消息创建失败')
          if (res.data.body.errorCode === '0') {
            this.$router.push('/main/messageList')
          }
        })
      },
      uploadFile (res) {
        this.msgForm.fileId = res.body.fileId
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