import Login from '@/Login'
import Main from '@/Main'
import Redirect from '@/Redirect'

import Home from '@/Home'

export default [{
  path: '/login',
  component: Login
}, {
  path: '/main',
  component: Main,
  children: [{
    path: '',
    component: Home
  }, {
    path: 'home',
    component: Home
  }, {
    path: 'branchList',
    component: () => import('@/main/branchManage/BranchList' /* webpackChunkName: 'branchList' */)
  }, {
    path: 'role',
    component: () => import('@/main/role/Role' /* webpackChunkName: 'role' */)
  }, {
    path: 'user',
    component: () => import('@/main/user/User' /* webpackChunkName: 'user' */)
  }, {
    path: 'postList',
    component: () => import('@/main/post/PostList' /* webpackChunkName: 'postList' */)
  }, {
    path: 'relationList',
    component: () => import('@/main/relation/RelationList' /* webpackChunkName: 'relationList' */)
  }, {
    path: 'relationSet',
    component: () => import('@/main/relation/RelationSet' /* webpackChunkName: 'relationSet' */)
  }, {
    path: 'checkList',
    component: () => import('@/main/check/CheckList' /* webpackChunkName: 'checkList' */)
  }, {
    path: 'checkHistoryList',
    component: () => import('@/main/check/CheckHistoryList' /* webpackChunkName: 'checkHistoryList' */)
  }, {
    path: 'pendHistoryList',
    component: () => import('@/main/check/PendHistoryList' /* webpackChunkName: 'pendHistoryList' */)
  }, {
    path: 'upgradeManage',
    component: () => import('@/main/release/UpgradeManage' /* webpackChunkName: 'upgradeManage' */)
  }, {
    path: 'upgradeTask',
    component: () => import('@/main/release/upgrade/UpgradeTask' /* webpackChunkName: 'upgradeTask' */)
  }, {
    path: 'nebulaList',
    component: () => import('@/main/release/nebulaList/NebulaList' /* webpackChunkName: 'nebulaList' */),
    children: [{
      path: '',
      component: () => import('@/main/release/nebulaList/main/Main')
    }, {
      name: 'newConfig',
      path: 'newConfig:id',
      component: () => import('@/main/release/nebulaList/newConfig/NewConfig')
    }, {
      name: 'moduleMsg',
      path: 'moduleMsg:row',
      component: () => import('@/main/release/nebulaList/main/ModuleMsg')
    }]
  }, {
    path: 'hotpatchManage',
    component: () => import('@/main/release/HotpatchManage' /* webpackChunkName: 'hotpatchManage' */)
  }, {
    path: 'hotpatchTask',
    component: () => import('@/main/release/HotpatchTask' /* webpackChunkName: 'hotpatchTask' */)
  }, {
    path: 'resourceManage',
    component: () => import('@/main/release/ResourceManage' /* webpackChunkName: 'resourceManage' */)
  }, {
    path: 'whiteListManage',
    component: () => import('@/main/release/WhiteListManage' /* webpackChunkName: 'whiteListManage' */)
  }, {
    path: 'createMessage',
    component: () => import('@/main/message/CreateMessage' /* webpackChunkName: 'createMessage' */)
  }, {
    path: 'messageList',
    component: () => import('@/main/message/MessageList' /* webpackChunkName: 'messageList' */)
  }, {
    path: 'messageTemplate',
    component: () => import('@/main/message/MessageTemplate' /* webpackChunkName: 'messageTemplate' */)
  }, {
    path: 'thirdPartyList',
    component: () => import('@/main/accessManage/ThirdPartyList' /* webpackChunkName: 'thirdPartyList' */)
  }, {
    path: 'createPublish',
    component: () => import('@/main/release/nebulaList/newConfig/CreatePublish' /* webpackChunkName: 'thirdPartyList' */)
  }, {
    path: ''
  }, {
    path: 'state',
    component: () => import('@/State' /* webpackChunkName: 'state' */)
  }]
}, {
  path: '/redirect',
  component: Redirect
}, {
  path: '*',
  redirect: '/redirect'
}]
