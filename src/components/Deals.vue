<template>
  <div>
    <h1>Заказы</h1>
    <div class="deal-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
      <b-button variant="primary" @click="showModal">Добавить договор</b-button>
    </div>
    <b-table striped hover :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
    
    <b-modal ref="add-deal" hide-footer title="Добавить договор" size="lg">
      <div class="add-deal-modal">
        <form class="add-deal-form" @submit.prevent="onAddSubmit">
          <b-tabs class="add-deal-tabs">
            <b-tab title="Добавить заказчика">
              <b-input v-model="data.name" placeholder="Ф.И.О. заказчика" />
              <b-input v-model="data.ogrn" placeholder="ОГРН заказчика" />
              <b-input v-model="data.inn" placeholder="ИНН заказчика" />
              <b-input v-model="data.address" placeholder="Адрес заказчика" />
              <b-input v-model="data.phone" placeholder="Телефон заказчика" />
              <b-input v-model="data.email" placeholder="Email заказчика" />
            </b-tab>
            <b-tab title="Выбрать заказчика">
              <v-select v-model="selectedCustomers" :options="customers" label="ogrn"  placeholder="Выберите заказчика"/>
            </b-tab>
          </b-tabs>

          <v-select :options="services" v-model="selectedServices" multiple label="name" placeholder="Выберите услуги"/>
          <div class="add-deal-dates">
            <label>Дата заключения договора</label>
            <date-picker v-model="data.deal_date" type="date" valueType="format" format="DD.MM.YYYY"/>
          </div>
          <div class="add-deal-dates">
            <label>Дата завершения работ</label>
            <date-picker v-model="data.finish_date" type="date" valueType="format" format="DD.MM.YYYY"/>
          </div>

          <div class="add-deal-buttons">
            <b-button type="confirm" variant="primary" @click="hideModal">Добавить</b-button>
            <b-button type="reset" variant="primary" @click="hideModal">Отмена</b-button>
          </div>
        </form>
        <div class="add-deal-services">
          <h5>Список оказываемых услуг</h5>
          <b-row v-for="service in selectedServices" :key="service.id">
            <b-col>{{service.name}}</b-col>
            <b-col><b-input v-model="service.quantity" placeholder="кв.м"/></b-col>
          </b-row>
        </div>
      </div>
  </b-modal>

  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        name: '',
        ogrn: '',
        inn: '',
        address: '',
        phone: '',
        email: '',
        deal_date: '',
        finish_date: '',
      },
      selectedCustomers: null,
      selectedServices: [],
      customers: [],
      services: [],
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
      .then(({data}) => {
        this.customers = data
      })
      .catch((error) => {
        console.log(error)
      })

    this.$axios.post('/get-services', { token: this.token })
      .then(({ data }) => {
        this.services = data
      })
      .catch((error) => {
        console.log(error)
      })

    this.busy = true
    this.$axios.post('/get-deals', { token: this.token })
      .then(({ data }) => {
        this.items = data
        this.rows = data.length
        this.busy = false
      })
      .catch((error) => console.log(error))
  },
  methods: {
    showModal() {
      this.$refs['add-deal'].show()
    },
    hideModal() {
      this.$refs['add-deal'].hide()
    },
    formatDate(date) {
      const parts = date.split('.')
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    },
    onAddSubmit() {
      this.data.deal_date = this.formatDate(this.data.deal_date)
      this.data.finish_date = this.formatDate(this.data.finish_date)
      this.$axios.post('/add-deal', { ...this.data, services: this.selectedServices, token: this.token })
    }
  }
}
</script>

<style scoped>
.deal-controls {
  width: 100%;
  display: flex;
}
h1 {
  margin-bottom: 1em;
}
.deal-controls button {
  margin-bottom: 1rem;
  min-width: 150px;
  height: calc(1.5em + 0.75rem + 2px);
  justify-self: flex-end;
}
.add-deal-modal {
  display: flex;
}
.add-deal-form {
  flex: 1;
  border-right: 1px solid #dee2e6;
  padding-right: 1em;
}
.add-deal-form > * {
  margin-bottom: 1em;
}
.add-deal-services {
  width: 45%;
  padding-left: 2em;
}
.add-deal-services h5{
  margin-bottom: 2em;
}
.add-deal-services .col:last-child {
  max-width: 8em;
}
.add-deal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
}
.add-deal-buttons button {
  margin-left: 1em;
}
.add-deal-tabs {
  border-bottom: 1px solid #dee2e6;
}
.add-deal-tabs > div > div > *:first-child {
  margin-top: 1em;
}
.add-deal-tabs > div > div > * {
  margin-bottom: 1em;
}
.row {
  margin-bottom: 1em;
}
.add-deal-dates {
  display: flex;
  justify-content: space-between;
}
</style>