import Vue from 'vue'
import App from './App'
import http from './http/api.js'
import store from './store/index.js'
import config from './config/index.js'

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.prototype.$store = store
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
