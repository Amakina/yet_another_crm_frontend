import Vue from 'vue'

export const store = Vue.observable({
  error: null
})

export const mutations = {
  setError(error) {
    store.error = error
  }
}