<template>
  <div class="form-container">
    <h1>Зарегистрировать компанию</h1>
    <b-form action="/signup" method="POST" @submit.prevent="onSubmit">
      <div v-if="page == 1">
        <b-form-input v-model="data.company_name" name="company_name" placeholder="Название компании" required/>
        <b-form-input v-model="data.company_ogrn" name="company_ogrn" placeholder="ОГРН" maxlength="13" required/>
        <b-form-input v-model="data.company_phone" name="company_phone" type="tel" placeholder="Телефон" maxlength="11" required/>
        <b-form-input v-model="data.company_email" name="company_email" type="email" placeholder="email@mail.com" required/>
        <b-form-input v-model="data.company_address" name="company_address" placeholder="Адрес" required/>
        <b-button variant="primary" block @click="onContinueClick">Продолжить</b-button>
      </div>
      <div v-else>
        <b-form-input v-model="data.user_name" name="user_name" placeholder="Ф.И.О." required/>
        <b-form-input v-model="data.user_email" name="user_email" type="email" placeholder="email@mail.com" required/>
        <b-form-input v-model="data.user_password" name="user_password" type="password" placeholder="Пароль" minlength="8" required/>
        <b-form-input v-model="repeat_password" name="repeat_password" type="password" placeholder="Повторите пароль" minlength="8" required/>
        <b-button type="submit" variant="primary" block>Зарегистрироваться</b-button>
        <b-button variant="primary" block @click="onBackClick">Назад</b-button>
      </div>
      <router-link to="/login">Уже зарегистрированы? Войти</router-link>
    </b-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      page: 1,
      repeat_password: '',
      data: {
        company_name: '',
        company_ogrn: '',
        company_phone: '',
        company_email: '',
        company_address: '',
        user_name: '',
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
      if (this.repeat_password !== this.data.user_password) return
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
  margin-bottom: 2em;
}
h1 {
  margin-top: 2em;
  margin-bottom: 2em;
}
</style>