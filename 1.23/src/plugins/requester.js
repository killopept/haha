import Axios from '~/utils/requester'

export default {
  install (Vue, options) {
    Object.defineProperty(Vue.prototype, '$axios', { value: Axios })
  }
}
