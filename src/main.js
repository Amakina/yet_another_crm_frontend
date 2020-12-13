import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import DatePicker from 'vue2-datepicker'
import App from './App.vue'
import router from './router'
import axios from './axios_config'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue2-datepicker/index.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(DatePicker)

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
