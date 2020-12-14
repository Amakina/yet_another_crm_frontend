import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import DatePicker from 'vue2-datepicker'
import vSelect from 'vue-select'
import App from './App.vue'
import router from './router'
import axios from './axios_config'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue2-datepicker/index.css'
import 'vue-select/dist/vue-select.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(DatePicker)

Vue.component('v-select', vSelect)

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
