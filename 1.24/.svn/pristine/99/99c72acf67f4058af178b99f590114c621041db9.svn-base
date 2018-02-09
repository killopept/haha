<template>
  <div class="app-header">
    <div class="app-header">
      <div class="logo"></div>
      <div class="guide">
        <router-link to="/main/home"  active-class="active">首页</router-link>
      </div>
      <div class="app-sidebar">
        <div style="height: 100%; width: 100%; position: relative; overflow-x: hidden;">
          <div style="height: 100%; width: 100%; position: relative; overflow-x: hidden; padding-right: 20px; box-sizing: border-box;">
            <div style="width: 200px;height:100%; background: none;">
              <div class="menu">
                <div class="menu-title"><span>系统管理</span></div>
                <div class="subMenu">
                  <div class="title single">
                    <router-link to="/main/branchList" active-class="active">
                      <i class="iconfont organization"></i><!-- react-text: 36 -->机构管理<!-- /react-text -->
                    </router-link>
                  </div>
                </div>
                <div class="subMenu">
                  <div class="title single">
                    <router-link to="/main/role" active-class="active">
                      <i class="iconfont roleManage"></i><!-- react-text: 41 -->角色管理<!-- /react-text -->
                    </router-link>
                  </div>
                </div>
                <div class="subMenu">
                  <div class="title single">
                    <router-link to="/main/user" active-class="active">
                      <i class="iconfont userManage"></i><!-- react-text: 46 -->用戶管理<!-- /react-text -->
                    </router-link>
                  </div>
                </div>
                <div class="subMenu">
                  <div class="title single">
                    <router-link to="/main/postList" active-class="active">
                      <i class="iconfont postManage"></i><!-- react-text: 51 -->岗位管理<!-- /react-text -->
                    </router-link>
                  </div>
                </div>
                <div class="subMenu">
                  <div class="title arr" data-state="0" @click="handleClick">
                    <i class="iconfont strategyManage"></i><!-- react-text: 55 -->策略管理<!-- /react-text -->
                  </div>
                  <div class="menuList">
                    <div class="item">
                      <router-link to="/main/relationList" active-class="active">审查设置</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/relationSet" active-class="active">策略设置</router-link>
                    </div>
                  </div>
                </div>
                <div class="subMenu" @click="handleClick">
                  <div class="title arr" data-state="0"><i class="iconfont reviewManage"></i><!-- react-text: 64 -->审查管理<!-- /react-text --></div>
                  <div class="menuList">
                    <div class="item">
                      <router-link to="/main/checkList" active-class="active">审批列表</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/checkHistoryList" active-class="active">审批历史</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/pendHistoryList" active-class="active">申请记录</router-link>
                    </div>
                  </div>
                </div>
                <div class="subMenu"  @click="handleClick">
                  <div class="title arr" data-state="0">
                    <i class="iconfont realTimeRelease"></i><!-- react-text: 75 -->实时发布<!-- /react-text -->
                  </div>
                  <div class="menuList">
                    <div class="item">
                      <router-link to="/main/upgradeManage" active-class="active">发布管理</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/hotpatchManage" active-class="active">热修复管理</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/nebulaList" active-class="active">离线包管理</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/whiteListManage" active-class="active">白名单管理</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/resourceManage" active-class="active">资源配置管理</router-link>
                    </div>
                  </div>
                </div>
                <div class="subMenu" @click="handleClick">
                  <div class="title arr" data-state="0"><i class="iconfont messagePush"></i><!-- react-text: 90 -->消息推送<!-- /react-text --></div>
                  <div class="menuList">
                    <div class="item">
                      <router-link to="/main/createMessage" active-class="active">新建消息</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/messageList" active-class="active">消息列表</router-link>
                    </div>
                    <div class="item">
                      <router-link to="/main/messageTemplate" active-class="active">消息模板</router-link>
                    </div>
                  </div>
                </div>
                <div class="subMenu" @click="handleClick">
                  <div class="title arr" data-state="0">
                    <i class="iconfont authority"></i><!-- react-text: 101 -->权限管理<!-- /react-text -->
                  </div>
                  <div class="menuList">
                    <div class="item">
                      <router-link to="/main/thirdPartyList" active-class="active">第三方列表</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="position: absolute; top: 0px; right: 0px; width: 11px; padding: 2px; opacity: 1; transition: opacity 0.3s; display: block; height: 99.8229px;">
            <i style="width: 100%; height: 100%; background: rgb(0, 0, 0); opacity: 0.2; border-radius: 4px;"></i>
          </div>
        </div>
      </div>
      <div class="app-account">
        <div class="avatar-s" @mouseenter="handleMouseover" @mouseleave="handleMouseout">
          <img alt="avatar" src="../assets/images/avatar.png">
        </div>
        <span class="welcome"><!-- react-text: 111 -->欢迎回来，<!-- /react-text --><!-- react-text: 112 -->{{userName}}<!-- /react-text --></span>
        <span class="cancel" @click="handleLogout">退出登录</span>
        <div class="card" :class="{show:showCard}" @mouseenter="handleMouseover" @mouseleave="handleMouseout">
          <div class="up">
            <div class="avatar-m">
              <img alt="avatar" src="../assets/images/avatar.png">
            </div><!-- react-text: 118 -->admin001<!-- /react-text -->
          </div>
          <div class="down">
            <div class="item" @click="updatePassword">修改密码</div>
            <div class="item" @click="handleLogout">退出登录</div>
          </div>
          </div>
        </div>
      </div>
      <div class="app-modal-box-mask" v-show="showModalBox">
        <div class="app-modal-box">
          <div class="title">修改密码</div>
          <div class="content">
            <div class="app-form-item">
              <div class="label req">请输入旧密码：</div>
            <div class="app-input">
              <input type="password" value="" name="oldPswd" placeholder="密码为6-16位数字或字母">
            </div>
          </div>
          <div class="app-form-item">
            <div class="label req">请输入新密码：</div>
            <div class="app-input">
              <input type="password" value="" name="newPswd" placeholder="密码为6-16位数字或字母">
            </div>
          </div>
          <div class="app-form-item">
            <div class="label req">请再次输入新密码：</div>
            <div class="app-input">
              <input type="password" value="" name="newAgainPswd" placeholder="密码为6-16位数字或字母">
            </div>
          </div>
        </div>
        <div class="app-double-btn">
          <button class="app-btn hollow"  @click="onClose">返回</button>
          <button class="app-btn" @click="onSubmit">保存</button>
        </div>
        <i class="close" @click="onClose"></i>
      </div>
    </div>
  </div>  
</template>

<style lang="scss">
.app-header{
  ::-webkit-scrollbar {  
    width: 0px;
  }
  :hover::-webkit-scrollbar {  
  width: 8px;
  } 
  :hover::-webkit-scrollbar-track
  {  
      /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);   */
      border-radius: 5px;  
      background-color: #ebf4f8;  
  }
  :hover::-webkit-scrollbar-thumb
  {  
      border-radius: 5px;  
      /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);   */
      background-color: #bec2c5;  
  }
}
  
</style>

<script>
  import { getAuthreSource } from '~/config/api'

  export default {
    name: 'app-header',
    data: () => {
      return {
        showCard: false,
        avatarTimer: null,
        showModalBox: false,
        userName: 'admin'
      }
    },
    mounted () {
      this.getLoginInfo()
    },
    methods: {
      getLoginInfo () {
        getAuthreSource().then(res => {
          this.userName = res.data.body.cstName
        })
      },
      handleClick: function (event) {
        var ele = event.target
        if (ele.getAttribute('data-state') === '0') {
          ele.parentNode.className = 'subMenu active'
          ele.setAttribute('data-state', '1')
        } else {
          ele.parentNode.className = 'subMenu'
          ele.setAttribute('data-state', '0')
        }
      },
      handleMouseover () {
        clearTimeout(this.avatarTimer)
        this.showCard = true
      },
      handleMouseout () {
        this.avatarTimer = setTimeout(() => {
          this.showCard = false
        }, 300)
      },
      handleLogout () {
        this.$router.push('/login')
      },
      updatePassword () {
        this.showModalBox = true
      },
      onClose () {
        this.showModalBox = false
      },
      onSubmit () {
        this.showModalBox = false
      }
    }
  }
</script>
