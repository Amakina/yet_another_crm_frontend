<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Главная</router-link>
      <router-link to="/control-panel">Панель управления</router-link>
      <router-link to="/logout" v-if="token">Выход</router-link>
      <router-link to="/login" v-else>Войти</router-link>
    </div>
    <div class="error" v-if="error">{{error}}</div>
    <router-view/>
  </div>
</template>

<script>
import { store, mutations } from './store'

export default {
  computed: {
    token() {
      return localStorage.getItem('token')
    },
    error() {
      return store.error
    }
  },
  watch: {
    error(value) {
      if (value) {
        setTimeout(() => {
          mutations.setError('')
        }, 3000)
      }
    }
  }
}
</script>

<style>
#nav {
  padding: 30px 50px 30px 50px;
  font-size: 20px;
  display: flex;
  justify-content: flex-end;
}
#nav a {
  margin-left: 1em;
}
.error {
  position: fixed;
  right: 50px;
  top: 50px;
  z-index: 2000;
  width: 400px;
  background: white;
  box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 15%);
  border: 2px solid #dee2e6;
  border-radius: 10px;
  padding: 20px;
}
</style>
