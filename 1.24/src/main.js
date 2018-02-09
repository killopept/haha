import './utils/requestAnimationFrame'
import Vue from 'vue'
import router from './router'
import { sync } from 'vuex-router-sync'
import requester from './plugins/requester'
import App from './App.vue'
import store from './vuex/store'
import * as filters from './filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

sync(store, router)

Vue.use(ElementUI)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const plugins = [requester]

plugins.forEach(plugin => {
  Vue.use(plugin)
})

const app = new Vue({
  router,
  store,
  ...App,
  render: h => h(App)
})

app.$mount('#MOUNT_NODE')
