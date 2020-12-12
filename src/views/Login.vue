<template>
  <div class="form-container">
    <h1>Войти</h1>
    <b-form action="/login" method="POST" @submit.prevent="onSubmit">
      <div>
        <b-form-input v-model="data.user_email" name="user_email" type="email" placeholder="email@mail.com" required/>
        <b-form-input v-model="data.user_password" name="user_password" type="password" placeholder="Пароль" minlength="8" required/>
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
        user_email: '',
        user_password: '',
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
      this.$axios.post('/signup', this.data)
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
}
h1 {
  margin-top: 2em;
  margin-bottom: 2em;
}
</style>