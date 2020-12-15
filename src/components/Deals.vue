<template>
  <div>
    <h1>Заказы</h1>
    <div class="deal-controls">
      <div class="deal-main-controls">
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
        </b-pagination>
        <b-button class="deal-controls-add" variant="primary" @click="showModal">Добавить договор</b-button>
      </div>
      <div class="deal-sub-controls">
        <b-check class="deal-controls-checkbox" @input="getNotPaid">Показать только неоплаченные заказы</b-check>
        <date-picker 
          class="deal-controls-date" 
          v-model="filterDate" 
          placeholder="Выберите период" 
          range type="date" 
          valueType="format" 
          format="DD.MM.YYYY"
        />
        <v-select class="deal-controls-sort" v-model="sortField" :options="sortFields" label="key" placeholder="Сортировать по"/>
        <div class="deal-sub-controls-confirm">
          <v-select class="deal-controls-select" v-model="searchField" :options="searchFields" label="key" placeholder="Поиск по"/>
          <b-input class="deal-controls-search" placeholder="Поиск"/>
          <b-button class="deal-controls-filter" variant="primary" @click="filterSearch">Применить</b-button>
        </div>
      </div>
    </div>
    <b-table 
      striped 
      hover 
      :items="items"  
      :fields="fields"
      :per-page="perPage" 
      :current-page="currentPage" 
      @row-clicked="onRowClick"
    >
      <template #cell(delete)="data">
        <a @click="deleteService(data.item.id)">Удалить</a>
      </template>
    </b-table>
    
    <b-modal ref="add-deal" hide-footer title="Добавить договор" size="lg" no-close-on-backdrop>
      <div class="add-deal-modal">
        <form class="add-deal-form" @submit.prevent="onAddSubmit">
          <b-tabs class="add-deal-tabs">
            <b-tab title="Добавить заказчика" v-if="!update">
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

          <b-input v-model="data.deal_id" placeholder="Номер договора" />
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
        customer_id: null,
        deal_id: '',
        name: '',
        ogrn: '',
        inn: '',
        address: '',
        phone: '',
        email: '',
        deal_date: '',
        finish_date: '',
      },
      filterDate: '',
      search: '',
      searchField: '',
      searchFields: [{ key: '№ договора', value: 'deal_id' }, { key: 'Статус', value: 'status' }, { key: 'Заказчик', value: 'customer_name' }],
      sortField: '',
      sortFields: [
        { key: '№ договора - по возрастнию', value: 'deal_id', dir: 1 }, 
        { key: '№ договора - по убыванию', value: 'deal_id', dir: 0 }, 
        { key: 'К оплате - по возрастанию', value: 'final_sum', dir: 1 }, 
        { key: 'К оплате - по убыванию', value: 'final_sum', dir: 0 }
      ],
      selectedCustomers: null,
      selectedServices: [],
      customers: [],
      services: [],
      busy: true,
      currentPage: 1,
      perPage: 10,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID'
        },
        {
          key: 'deal_id',
          label: '№ договора'
        },
        {
          key: 'status',
          label: 'Статус',
        },
        {
          key: 'deal_date',
          label: 'Дата заключения договора'
        },
        {
          key: 'finish_date',
          label: 'Дата завершения работ',
        }, 
        {
          key: 'customer_name',
          label: 'Заказчик'
        },
        {
          key: 'final_sum',
          label: 'К оплате'
        },
        {
          key: 'delete',
          label: ''
        }
      ],
      all: [],
      notPaid: [],
      update: false,
    }
  },
  computed: {
    token() {
      return window.localStorage.getItem('token') || {}
    },
    rows() {
      return this.items.length
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
        this.handleData(data, 'all')
        this.items = this.clone(this.all)
        this.busy = false
      })
      .catch((error) => console.log(error))
    this.$axios.post('/get-not-paid-deals', { token: this.token })
      .then(({ data }) => {
        this.handleData(data, 'notPaid')
      })
      .catch((error) => console.log(error))
  },
  methods: {
    handleData(data, arrayName) {
      if (!data || !data.length) return
      let prev = data[0].id
      let same = []
      data.forEach((e, i) => {
        if (e.id === prev && e.service_name) {
          same.push(e)
          prev = e.id
        }
        else {
          e.selectedServices = same
          same = []
          prev = i + 1 < data.length ? data[i + 1].id : -1
        }
      })
      this[arrayName] = data.filter((e) => {
        return !e.service_name && e.id
      })
    },
    resetData() {
      this.data = {
        customer_id: null,
        deal_id: '',
        name: '',
        ogrn: '',
        inn: '',
        address: '',
        phone: '',
        email: '',
        deal_date: '',
        finish_date: '',
      }
      this.update = false
      this.selectedCustomers = null
      this.selectedServices = []
    },
    showModal() {
      this.resetData()
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
      const fixedDealDate = this.formatDate(this.data.deal_date)
      const fixedFinishDate = this.formatDate(this.data.finish_date)
      const fixedData = { 
        ...this.data, 
        customer_id: this.selectedCustomers ? this.selectedCustomers.id : null ,
        finish_date: fixedFinishDate, 
        deal_date: fixedDealDate,
        services: this.selectedServices, 
        token: this.token 
      }
      if (!this.update) {
        this.$axios.post('/add-deal', fixedData)
          .then(() => {
            this.notPaid.push(this.data)
            this.all.push(this.data)
            this.items.push(this.data)
          })
          .catch((error) => console.log(error))
        return
      }

      this.$axios.post('/update-deal', fixedData)
        .then(() => {
          Object.keys(fixedData).forEach((key) => {
            this.selectedRecord[key] = fixedData[key]
          })
          this.selectedRecord.selectedServices = fixedData.services
          this.selectedRecord = null
        })
        .catch((error) => console.log(error))
    },
    clone(o) {
      return JSON.parse(JSON.stringify(o))
    },
    onRowClick(record) {
      this.update = true
      this.error = ''
      this.data = this.clone(record)
      this.selectedCustomers = this.customers.find(o => o.id == this.data.customer_id)
      this.selectedServices = this.clone(this.services)
        .filter(o => this.data.selectedServices.find(s => {
          if (s.service_id === o.id || s.id === o.id) o.quantity = s.quantity
          return s.service_id === o.id || s.id === o.id
        }))
      this.selectedRecord = record
      this.$refs['add-deal'].show()
    },
    deleteService(id) {
      for (let i = 0; i < this.items.length; i++) {
        if (id == this.items[i].id) {
          this.$axios.post('/delete-deal', { ...this.items[i], token: this.token })
            .then(() => {
              this.items.splice(i, 1)
            })
            .catch((error) => console.log(error))
          break
        }
      }
    },
    getNotPaid(value) {
      if (value) {
        this.items = this.clone(this.notPaid.map(e => ({...e, final_sum: e.final_sum - e.paid})))
        this.fields = this.fields.map(f => (f.key === 'final_sum' ? {...f, label: 'Долг'} : f))
      }
      else {
        this.items = this.clone(this.all)
        this.fields = this.fields.map(f => (f.key === 'final_sum' ? {...f, label: 'К оплате'} : f))
      }
    },
    filterSearch() {

    }
  }
}
</script>

<style scoped>
.deal-sub-controls {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  width: 100%;
}
.deal-sub-controls > div {
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
}
.deal-sub-controls-confirm {
  display: flex;
}
.deal-controls {
  display: flex;
}
.deal-main-controls {
  display: flex;
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
  flex-direction: column;
}
.deal-controls-checkbox {
  /*width: 750px;*/
  margin-right: 1em;
}
.deal-controls-date {
  /*width: 880px;*/
  margin-right: 1em;
}
.deal-controls-date input {
  height: calc(1.5em + 0.75rem + 2px);
}
.deal-controls-search {
  margin-right: 1em;
}
.deal-controls-select {
  width: 350px;
  margin-left: 1em;
  margin-right: 1em;
}
.deal-controls-sort {
  width: 300px;
  margin-right: 1em;
}
h1 {
  margin-bottom: 1em;
}
.deal-controls .deal-controls-add {
  margin-bottom: 1rem;
  min-width: 165px;
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
a {
  cursor: pointer!important;
}
a:hover {
  color: blue!important;
}
</style>