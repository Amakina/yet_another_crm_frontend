<template>
  <div class="form-container">
    <h1>Войти</h1>
    <b-form action="/login" method="POST" @submit.prevent="onSubmit">
      <div>
        <b-form-input v-model="data.username" name="username" type="email" placeholder="email@mail.com" required/>
        <b-form-input v-model="data.password" name="password" type="password" placeholder="Пароль" minlength="8" required/>
        <b-button type="submit" variant="primary" block>Войти</b-button>
        <router-link to="/signup">Еще не зарегистрированы? Регистрация</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      page: 1,
      data: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    onContinueClick() {
      this.page = 2;
    },
    onBackClick() {
      this.page = 1;
    },
    onSubmit() {
      this.$axios.post('/login', this.data)
        .then((result) => {
          window.localStorage.setItem('token',  result.data.token)
          this.$router.push('Home')
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.form-container {
  margin: 0 auto;
  max-width: 600px;
}
form input{
  margin-top: 1.5em;
}
form button {
  margin-top: 1.5em;
  margin-bottom: 2em;
}
h1 {
  margin-top: 2em;
  margin-bottom: 2em;
}
</style>