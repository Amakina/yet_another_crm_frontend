<template>
  <div class="container">
    <form action="/create-user" method="post" @submit.prevent="createUser">
      <h1>Create user</h1>
      <b-form-input v-model="user_email" placeholder="E-mail" name="user_email" type="email" required/>
      <b-form-input v-model="user_password" placeholder="Password" name="user_password" type="password" minlength="8" required/>
      <b-form-input v-model="confirmPassword" placeholder="Confirm password" name="confirm_password" type="password" minlength="8"/>
      <b-form-input v-model="user_name" placeholder="Name" name="user_name" type="text" required/>
      <b-form-select v-model="role" :options="[1, 2]"/>
      <b-button variant="primary" type="submit">Create user</b-button>
      <div v-if="error" class="error">{{error}}</div>
      <div v-else-if="success" class="success">{{success}}</div>
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user_email: '',
        user_password: '',
        user_name: '',
        role: 1,
        error: '',
        success: '',
        confirmPassword: ''
      }
    },
    computed: {
        token() {
            return window.localStorage.getItem('token') || {}
        },
    },
    methods: {
      createUser() {
        if (this.confirmPassword != this.user_password && this.user_password) {
          this.error = 'Passwords are not matching'
          return
        }
        this.$axios.post('/create-user', { 
            user_email: this.user_email, 
            user_password: this.user_password, 
            user_name: this.user_name, 
            role: this.role,
            token: this.token
          })
          .then(() => {
            this.success = `User ${this.user_email} has been signed up`
            this.user_email = ''
            this.user_password = ''
            this.user_name = ''
            this.role = 1
            this.error = ''
            this.confirmPassword = ''
          })
          .catch((error) => {
            this.error = error.response.data.message
          })
      },
    }
  }
</script>

<style scoped>
  .container {
    max-width: 400px;
    display: flex;
    flex-direction: column;
  }

  .container form * {
    margin-top: 1em;
    width: 100%;
  }

  h1 {
    text-align: center;
    margin-bottom: 2em;
  }

  a {
    text-align: center;
    margin-top: 3em;
  }

  .error {
    color: red;
  }

  .success {
    color: green;
  }

  .back-link {
    text-align: right;
    margin-top: 1em;
  }
</style>