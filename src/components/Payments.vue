<template>
  <div>
    <h1>Подтверждение оплаты</h1>
    <div class="payment-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
      <b-button variant="primary" @click="showModal">Добавить чек</b-button>
    </div>
    <b-table striped hover :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
    
    <b-modal ref="add-check" hide-footer title="Добавить чек">
      <form class="add-check-form" @submit.prevent="onAddSubmit">
        <v-select v-model="data.selected" :options="options" label="deal_id" placeholder="Выберите договор" />
        <b-input v-model="data.check" placeholder="Номер чека"/>
        <div class="add-payment-date">
          <label>Дата и время оплаты:</label>
          <date-picker v-model="data.date" type="datetime" valueType="format" format="DD.MM.YYYY HH:mm"/>
        </div>
        <b-input v-model="data.sum" placeholder="Сумма оплаты"/>

        <div class="add-check-buttons">
          <b-button type="confirm" variant="primary" @click="hideModal">Добавить</b-button>
          <b-button type="reset" variant="primary" @click="hideModal">Отмена</b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>


<script>
export default {
  data() {
    return {
      data: {
        selected: null,
        check: '',
        date: '',
        sum: '',
      },
      options: [],
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
    this.busy = true
    this.$axios.post('/get-payments', { token: this.token })
      .then(({ data }) =>  this.items = data)
      .catch((error) => console.log(error))

    this.$axios.post('/get-deals', { token: this.token })
    .then(({ data }) =>  this.options = data)
    .catch((error) => console.log(error))
  },
  methods: {
    showModal() {
      this.$refs['add-check'].show()
    },
    hideModal() {
      this.$refs['add-check'].hide()
    },
    formatDate(date) {
      const dateTime = date.split(' ')
      const parts = dateTime[0].split('.')
      return `${parts[2]}-${parts[1]}-${parts[0]} ${dateTime[1]}`
    },
    onAddSubmit() {
      const fixedDate = this.formatDate(this.data.date)
      console.log(this.data.selected)
      this.$axios.post('/add-payment', { ...this.data, date: fixedDate, token: this.token })
        .then(() => console.log('success'))
        .catch((error) => console.log(error))
    }
  }
}
</script>

<style scoped>
.add-check-modal {
  display: flex;
}
.add-check-form {
  flex: 1;
}
.add-check-form > *{
  margin-bottom: 1em;
}
.add-check-services {
  width: 45%;
  padding-left: 2em;
}
.add-check-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
}
.add-check-buttons button {
  margin-left: 1em;
}
.payment-controls {
  display: flex;
}
.payment-controls button {
  margin-bottom: 1rem;
  min-width: 150px;
  height: calc(1.5em + 0.75rem + 2px);
  justify-self: flex-end;
}
.add-payment-date {
  display: flex;
  justify-content: space-between;
}
</style>