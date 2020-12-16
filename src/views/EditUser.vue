<template>
  <div>
    <div class="data-container">
      <div>
        <div class="table-controls">
          <b-pagination
            v-model="currentPage"
            :total-rows="total"
            :per-page="perPage"
            aria-controls="users-table"
          />
          <b-form-input
            v-model="filter"
            type="search"
            placeholder="Type to Search"
          />
          <label>Per page:</label><b-form-select v-model="perPage" :options="[5, 10, 20, 100, 200]"/>
        </div>
        <b-table 
          id="users-table"
          ref="table"
          :items="users"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          :filter-included-fields="[]"
          :bordered="true"
          :hover="true"
          @row-clicked="onClick"
        />
      </div>
      <b-modal title="Edit user" v-model="showModal" hide-footer>
        <form class="container"  action="/edit-user" method="post" @submit.prevent="save">
          <b-form-input v-model="selectedUser.email" placeholder="E-mail" name="username" type="email" required/>
          <b-form-input v-model="selectedUser.password" placeholder="New password" name="password" type="password" minlength="8"/>
          <b-form-input v-model="confirmPassword" placeholder="Confirm password" name="confirm_password" type="password" minlength="8"/>
          <b-form-input v-model="selectedUser.name" placeholder="Name" name="name" type="text" required/>
          <b-form-select v-model="selectedUser.role" :options="[1, 2]"/>
          <b-button variant="primary" type="submit">Save</b-button>
          <div v-if="error" class="error">{{error}}</div>
        </form>
    </b-modal>
    </div>
  </div>
</template>

<script>
import { mutations } from '../store'

export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      perPage: 10,
      filter: '',
      showModal: false,
      selectedUser: {},
      confirmPassword: '',
      selectedUserRecord: {},
      error: '',
      fields: [
        {
          key: 'id',
          label: 'ID'
        },
        {
          key: 'name',
          label: 'Имя'
        },
        {
          key: 'email',
          label: 'Email'
        },
        {
          key: 'role',
          label: 'Роль'
        },
      ],
    }
  },
  computed: { 
    total() {
      return this.users.length
    },
    token() {
      return window.localStorage.getItem('token') || {}
    },
  },
  mounted() {
    this.$axios.post('/get-users', { token: this.token })
        .then(({data}) => this.users = data)
        .catch((error) => mutations.setError(error.response.data))
  },
  methods: {
    onClick(record) {
      this.selectedUser = JSON.parse(JSON.stringify(record))
      this.selectedUserRecord = record
      this.error = ''
      this.confirmPassword = ''
      this.showModal = true
    },
    save() {
      if (this.confirmPassword != this.selectedUser.password && this.selectedUser.password) {
        this.error = 'Passwords are not matching'
        return
      }
      this.$axios.post('/edit-user', { ...this.selectedUser, token: this.token })
        .then(() => {
          this.selectedUserRecord.email = this.selectedUser.email
          this.selectedUserRecord.name = this.selectedUser.name
          this.selectedUserRecord.role = this.selectedUser.role
          this.$refs.table.refresh()
          this.showModal = false
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
    }
  }
}
</script>

<style scoped>
.data-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 0;
}
.container {
  padding-bottom: 1em;
}
.container * {
  margin-top: 1em;
  width: 100%;
}
.table-controls {
  display: flex;
}

.table-controls input {
  margin-left: 20px;
}

.table-controls select {
  width: 100px;
  margin-left: 5px;
}
.table-controls label {
  width: 150px;
  margin-left: 20px;
  line-height: calc(1.5em + 0.75rem + 2px);
}
.error {
  color: red;
}
</style>