import Vue from 'vue'

export const store = Vue.observable({
  token: null
})

export const mutations = {
  setToken(token) {
    store.token = token
  }
}