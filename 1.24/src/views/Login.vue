<template>
   <div class="pageLogin">
      <div class="loginBox">
        <div class="avatar"><img alt='avatar' src='../assets/images/avatar.png' /></div>
        <div class="input pre-icon">
          <i class="user"></i>
          <input
            placeholder="请输入用户名"
            v-model="userName"
            name="userName"
            @focus="handleFocus($event)"
            @blur="handleBlur($event)"
          />
        </div>
        <div class="input pre-icon">
          <i class="pswd"></i>
          <input
            placeholder="请输入密码"
            type="password"
            v-model="pswd"
            name="pswd"
            @focus="handleFocus($event)"
            @blur="handleBlur($event)"
            
          />
        </div>
        <div class="input vcode">
          <input
            placeholder="请输入验证码"
            v-model="vcode"
            name="vcode"
            @focus="handleFocus($event)"
            @blur="handleBlur($event)"
          />
          <img 
            :src="checkCodeSrc"
            @click="reloadCode" 
          />
        </div>
        <div class="btn-wrap">
          <button @click="onLogin">立即登录</button>
        </div>
      </div>
    </div>
</template>

<script>
import { getSession, getLogin } from '~/config/api'
import { setCookie } from '~/utils/cookie'
import { mapActions } from 'vuex'
import md5 from 'md5'

export default {
  name: 'login',
  data () {
    return {
      userName: '',
      pswd: '',
      vcode: '',
      vcodeSrc: '',
      checkCodeSrc: ''
    }
  },
  methods: {
    ...mapActions({
      login: 'login',
      logout: 'logout'
    }),
    onLogin () {
      const loginInfo = {
        loginName: this.userName,
        loginPassword: md5(this.pswd),
        validateCodeText: this.vcode,
        isLogin: false
      }
      // console.log(loginInfo)
      getLogin(loginInfo).then(res => {
        const delayTime = 24 * 60 * 60 * 1000
        if (res.data.body.result === '1') {
          this.login(res.data.body.cstName)
          this.$router.push('/main/home')
          setCookie('eCIFID', res.data.body.cstNo, delayTime)
        }
      })
    },
    reloadCode () {
      this.getCheckCode()
    },
    handleFocus (e) {
      e.currentTarget.parentNode.classList.add('focus')
      // console.log(e.currentTarget.parentNode.classList)
    },
    handleBlur (e) {
      e.currentTarget.parentNode.classList.remove('focus')
    },
    getCheckCode () {
      getSession().then(res => {
        const checkCodeSrc = `https://flameapp.cn/inmanage/IM01003.do?nocache=${Date.now()}&iCIFID=${res.data.header.iCIFID}`
        this.checkCodeSrc = checkCodeSrc
      })
    }
  },
  mounted () {
    this.getCheckCode()
  }
}
</script>
