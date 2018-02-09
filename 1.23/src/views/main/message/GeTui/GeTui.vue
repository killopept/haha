<template>
  <el-form label-position="right" size="small" label-width="150px" :model="msgForm" :rules="msgRules" ref="msgForm" class="GeTui">
    <el-form-item label="消息描述" prop="title">
      <el-input v-model="msgForm.title" placeholder="用于标识信息，方便管理和查找"></el-input>
    </el-form-item>
    <el-form-item label="自定参数" prop="content">
      <el-input v-model="msgForm.content" type="textarea" placeholder="透传消息命令代码"></el-input>
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
    <el-form-item label="目标平台" prop="targetOs">
      <el-radio-group v-model="msgForm.targetOs">
        <el-radio label="0">全平台</el-radio>
        <el-radio label="1">Android</el-radio>
        <el-radio label="2">ios</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="通知类别" v-if="msgForm.targetOs !== '1'" prop="msgType">
      <el-radio-group v-model="msgForm.msgType">
        <el-radio-button label="base">基础通知</el-radio-button>
        <el-radio-button label="silence">静默通知</el-radio-button>
        <el-radio-button label="adviced">高级通知</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="content-available" v-if="msgForm.targetOs!=='1' && msgForm.msgType!=='base'">
      <el-input v-model="msgForm.contentAvailable"></el-input>
    </el-form-item>
    <el-form-item label="title" v-if="msgForm.msgType !== 'silence'">
      <el-input v-model="msgForm.minorTitle"></el-input>
    </el-form-item>
    <el-form-item label="subtitle" v-if="msgForm.targetOs!=='1' && msgForm.msgType==='adviced'">
      <el-input v-model="msgForm.subtitle"></el-input>
    </el-form-item>
    <el-form-item label="body" v-if="msgForm.msgType !== 'silence'" prop="message">
      <el-input v-model="msgForm.message"></el-input>
    </el-form-item>
    <div v-if="msgForm.targetOs!=='1' && msgForm.msgType==='adviced'">
      <el-form-item label="title-loc-key">
        <el-input v-model="msgForm.titleLocKey"></el-input>
      </el-form-item>
      <el-form-item label="title-loc-args">
        <el-input v-model="msgForm.titleLocArgs"></el-input>
      </el-form-item>
      <el-form-item label="subtitle-loc-key">
        <el-input v-model="msgForm.subtitleLocKey"></el-input>
      </el-form-item>
      <el-form-item label="subtitle-loc-args">
        <el-input v-model="msgForm.subtitleLocArgs"></el-input>
      </el-form-item>
      <el-form-item label="action-loc-key">
        <el-input v-model="msgForm.actionLocKey"></el-input>
      </el-form-item>
      <el-form-item label="ios-locArgs">
        <el-input v-model="msgForm.locArgs"></el-input>
      </el-form-item>
      <el-form-item label="loc-key">
        <el-input v-model="msgForm.locKey"></el-input>
      </el-form-item>
      <el-form-item label="launch-image">
        <el-input v-model="msgForm.launchImage"></el-input>
      </el-form-item>
      <el-form-item label="apns-collapse-id">
        <el-input v-model="msgForm.apnsCollapseId"></el-input>
      </el-form-item>
    </div>
    <div v-if="msgForm.targetOs!=='1'">
      <el-form-item label="badge">
        <el-input v-model="msgForm.badge"></el-input>
      </el-form-item>
      <el-form-item label="sound">
        <el-radio-group v-model="msgForm.soundCtrl">
          <el-radio label="com.gexin.ios.silence">无</el-radio>
          <el-radio label="default">默认</el-radio>
          <el-radio label="custom">自定义</el-radio>
          <el-input v-model="msgForm.sound" style="width: 30%" v-if="msgForm.soundCtrl === 'custom'" class="left-margin"></el-input>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="category">
        <el-input v-model="msgForm.category"></el-input>
      </el-form-item>
    </div>
    <div v-if="msgForm.targetOs!=='1' && msgForm.msgType!=='silence'">
      <el-form-item label="ios多媒体推送">
        <el-radio-group v-model="msgForm.mediaPush">
          <el-radio label="yes">是</el-radio>
          <el-radio label="no">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="msgForm.mediaPush === 'yes'">
        <el-form-item label="多媒体类型">
          <el-select v-model="msgForm.type">
            <el-option
              v-for="item in multiMedia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源下载环境">
          <el-radio-group v-model="msgForm.onlyWifi">
            <el-radio label='false'>不限</el-radio>
            <el-radio label='true'>仅wifi</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="多媒体地址" prop="url">
          <el-input v-model="msgForm.url"></el-input>
        </el-form-item>
      </div>
    </div>
    <el-form-item label="推送时间" prop="time">
      <el-radio-group v-model="msgForm.time">
        <el-radio label="immediately">即时</el-radio>
        <el-radio label="timing">定时</el-radio>
        <el-date-picker
          v-if="msgForm.time === 'timing'"
          v-model="msgForm.sendTime"
          type="datetime"
          placeholder="选择日期时间"
          class="left-margin"
          value-format="yyyyMMddHHmmss"
        ></el-date-picker>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="进离线消息" prop="offline">
      <el-radio-group v-model="msgForm.offline">
        <el-radio label='true'>是</el-radio>
        <el-radio label='false'>否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="有效时长" prop="offlineTime">
      <el-input-number v-model="msgForm.offlineTime" controls-position="right" :min="1" :max="72"></el-input-number>
      小时，该时间段内在线过的用户均可收到通知。(1-72小时)
    </el-form-item>
    <el-form-item label="定速推送">
      <el-radio-group v-model="msgForm.pushSpeedCtrl">
        <el-radio label="close">关闭</el-radio>
        <el-radio label="open">开启</el-radio>
        <span style="font-size: 0.8rem" v-if="msgForm.pushSpeedCtrl === 'open'">
          <el-input-number v-model="msgForm.pushSpeed" 
                          controls-position="right" 
                          :min="1" 
                          :max="5000" 
                          class="left-margin input-number-middle"
          ></el-input-number>
          条/秒，最大5000
        </span>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="展示条件">
      <el-radio-group v-model="msgForm.screenOn">
        <el-radio label="0">无</el-radio>
        <el-radio label="1">点亮屏幕</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item size="large">
      <el-button type="primary" @click="submit('msgForm')">确定</el-button>
      <!-- <el-button @click="resetForm('msgForm')">重置</el-button> -->
    </el-form-item>
    <el-form-item></el-form-item>
  </el-form>
</template>

<script>
  import { sendNewMessage, API } from '~/config/api'

  export default {
    data () {
      return {
        uploadUrl: API.uploadCidFile,
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
          appId: '1000000002',
          args: {},
          channel: '01',
          time: 'immediately',
          sendTime: '',
          systemId: '0001',
          targetUser: '0',
          targetOs: '0',
          tag: [],
          msgType: 'base',
          offline: 'false',
          screenOn: '0',
          content: '',
          pushSpeedCtrl: 'close',
          pushSpeed: '1',
          badge: '',
          soundCtrl: 'default',
          sound: '',
          category: '',
          contentAvailable: '',
          subtitle: '',
          titleLocKey: '',
          titleLocArgs: '',
          subtitleLocKey: '',
          subtitleLocArgs: '',
          actionLocKey: '',
          locKey: '',
          launchImage: '',
          apnsCollapseId: '',
          mediaPush: 'no',
          type: 'pic',
          onlyWifi: 'true',
          url: '',
          offlineTime: 2,
          minorTitle: '',
          message: '',
          title: ''
        },
        msgRules: {
          title: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '透传消息不能为空', trigger: 'blur' }
          ],
          targetUser: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          tag: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          targetOs: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          msgType: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          message: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          offline: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ],
          offlineTime: [
            { required: true, message: '该项为必填项', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit (formName) {
        // console.log(this.msgForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sendNewMsg(this.msgForm)
          } else {
            return false
          }
        })
      },
      sendNewMsg (data) {
        const multiMedia = data.mediaPush === 'no' ? {} : {
          type: data.type,
          onlyWifi: data.onlyWifi,
          url: data.url
        }
        const iosPushInfoCopy = {
          badge: data.badge,
          sound: data.soundCtrl === 'custom' ? data.sound : data.soundCtrl,
          category: data.category,
          contentAvailable: data.contentAvailable,
          subtitle: data.subtitle,
          titleLocKey: data.titleLocKey,
          titleLocArgs: data.titleLocArgs,
          subtitleLocKey: data.subtitleLocKey,
          subtitleLocArgs: data.subtitleLocArgs,
          actionLocKey: data.actionLocKey,
          locKey: data.locKey,
          launchImage: data.launchImage,
          apnsCollapseId: data.apnsCollapseId,
          multiMedia
        }
        const iosPushInfo = this.deleteNull(iosPushInfoCopy)
        const condition = {
          screenOn: data.screenOn
        }
        const templateInfo0 = this.getTemplateInfo0(data, iosPushInfo, condition)
        const targetUserInfo = this.getTargetUserInfo(data)
        const body = {
          appId: data.appId,
          args: data.args,
          channel: data.channel,
          title: data.title,
          sendTime: data.time === 'immediately' ? '0' : data.sendTime,
          systemId: data.systemId,
          targetUser: data.targetUser,
          targetUserInfo: JSON.stringify(targetUserInfo),
          templateInfo0: JSON.stringify(templateInfo0)
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
      getTemplateInfo0 (data, iosPushInfo, condition) {
        let templateInfo0 = {
          offline: data.offline,
          content: data.content,
          pushSpeed: data.pushSpeed,
          offlineTime: data.offlineTime,
          iosPushInfo: data.targetOs === '1' ? {} : iosPushInfo,
          condition
        }
        if (this.msgForm.msgType !== 'silence') {
          templateInfo0.title = data.minorTitle
          templateInfo0.message = data.message
        }
        return templateInfo0
      },
      getTargetUserInfo (data) {
        let targetUserInfo = {
          targetOs: data.targetOs === '0' ? '1,2' : data.targetOs
        }
        if (data.targetUser === '1') {
          targetUserInfo.tag = data.tag.join(',')
        }
        return targetUserInfo
      },
      deleteNull (obj) {
        for (let key in obj) {
          if (obj[key] === '' || obj[key] === {}) {
            delete obj[key]
          }
        }
        return obj
      },
      // resetForm (formName) {
      //  this.$refs[formName].resetFields()
      // },
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