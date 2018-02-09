<template>
  <div class="page-welcome">
    <div class="title">欢迎使用内部管理系统！</div>
    <div class="table">
      <table>
        <tbody>
          <tr>
            <td class="label">当前访问IP：</td>
            <td>{{ip}}</td>
          </tr>
          <tr><td class="label">当前访问时间：</td><td>{{time}}</td></tr>
          <tr><td class="label">最后一次访问IP：</td><td>{{lastIp}}</td></tr>
          <tr><td class="label">最后一次登录时间：</td><td>{{lastTime}}</td></tr>
          <tr><td class="label">当前登录次数：</td><td>{{loginTimes}}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getAuthreSource } from '~/config/api'

  export default {
    name: 'home',
    data () {
      return {
        ip: '',
        time: '',
        lastIp: '',
        lastTime: '',
        loginTimes: ''
      }
    },
    computed: {
      ...mapGetters({
        route: 'routePath'
      })
    },
    mounted () {
      this.getLoginInfo()
    },
    methods: {
      getLoginInfo () {
        getAuthreSource().then(res => {
          const data = res.data.body
          this.ip = data.cstCurrLoginIP
          this.time = data.cstCurrLoginTime
          this.lastIp = data.cstLastLoginIP
          this.lastTime = data.cstLastLoginTime
          this.loginTimes = data.cstLoginTimes
        })
      }
    }
  }
</script>

<style lang="scss">
  .page-welcome {
    .title {
      font-size: 22px;
      text-align: center;
      line-height: 90px;
      font-weight: 700;
    }        
    .table {
      padding: 0 80px;

      table {
        width: 100%;
        border: 0;
        margin: 0;
        border-collapse: collapse;
        border-spacing: 0;
        
        tr {
          &:hover {
            td {
              background-color: #F6FAFF;
            }
          }
          td {
            padding: 12px;
            border: 1px solid #f2f6fd;  
            &.label {
              text-align: right;
            }
          }  
        }

      }
    }
  }
</style>