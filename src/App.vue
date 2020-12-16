<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Главная</router-link>
      <router-link to="/control-panel">Панель управления</router-link>
      <router-link to="/logout" v-if="token">Выход</router-link>
      <router-link to="/login" v-else>Войти</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    token() {
      return localStorage.getItem('token')
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
</style>
