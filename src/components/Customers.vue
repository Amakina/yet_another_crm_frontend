<template>
  <div>
    <h1>Заказчики</h1>
    <div class="customer-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
    </div>
    <b-table striped hover :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      busy: true,
      currentPage: 1,
      rows: 0,
      perPage: 5,
      items: []
    }
  },
  computed: {
    token() {
      return window.localStorage.getItem('token') || {}
    }
  },
  mounted() {
    this.$axios.post('/get-customers', { token: this.token })
      .then(({ data }) => this.items = data)
      .catch((error) => console.log(error))
  },
  methods: {
    showModal() {
      this.$refs['add-event'].show()
    },
    hideModal() {
      this.$refs['add-event'].hide()
    },
  }
}
</script>

<style scoped>
.customer-controls {
  display: flex;
}
</style>