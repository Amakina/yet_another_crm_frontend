<template>
  <div>
    <h1>Заказчики</h1>
    <div class="customer-controls">
      <div class="customer-main-controls">
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
        </b-pagination>
      </div>
      <div class="customer-sub-controls">
        <b-check v-model="showRegulars" class="customer-controls-checkbox" @input="getRegulars">Показать постоянных покупателей</b-check>
        <v-select class="customer-controls-sort" v-model="extra.sortField" :options="extra.sortFields" label="key" placeholder="Сортировать по"/>
        <div class="customer-sub-controls-confirm">
          <v-select class="customer-controls-select" v-model="extra.searchField" :options="extra.searchFields" label="key" placeholder="Поиск по"/>
          <b-input v-model="extra.search" class="customer-controls-search" placeholder="Поиск"/>
          <b-button class="customer-controls-filter" variant="primary" @click="filterSearch">Применить</b-button>
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
    </b-table>

     <b-modal ref="add-customer" hide-footer title="Изменить данные заказчика">
      <form class="add-customer-form" @submit.prevent="onAddSubmit">
        <b-input v-model="data.name" placeholder="Ф.И.О. заказчика" />
        <b-input v-model="data.ogrn" placeholder="ОГРН заказчика" />
        <b-input v-model="data.inn" placeholder="ИНН заказчика" />
        <b-input v-model="data.address" placeholder="Адрес заказчика" />
        <b-input v-model="data.phone" placeholder="Телефон заказчика" />
        <b-input v-model="data.email" placeholder="Email заказчика" />
        <div class="add-customer-buttons">
          <b-button type="confirm" variant="primary" @click="hideModal">Изменить</b-button>
          <b-button type="reset" variant="primary" @click="hideModal">Отмена</b-button>
        </div>
      </form>
  </b-modal>
  </div>
</template>

<script>
import { mutations } from '../store'
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
      },
      busy: true,
      currentPage: 1,
      perPage: 5,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID'
        },
        {
          key: 'name',
          label: 'Название компании'
        },
        {
          key: 'ogrn',
          label: 'ОГРН',
        },
        {
          key: 'inn',
          label: 'ИНН'
        },
        {
          key: 'address',
          lebel: 'Адрес',
        }, 
        {
          key: 'phone',
          lebel: 'Телефон',
        }, 
        {
          key: 'email',
          lebel: 'E-mail',
        }
      ],
      all: [],
      regulars: [],
      showRegulars: false,
      extra: {
        search: '',
        searchField: '',
        searchFields: [
          { key: 'Название компании', value: 'name' }, 
          { key: 'ОГРН', value: 'ogrn' }, 
          { key: 'ИНН', value: 'inn' },
          { key: 'Адрес', value: 'address' }
        ],
        sortField: '',
        sortFields: [
          { key: 'Название компании - по возрастнию', value: 'name', dir: 1 }, 
          { key: 'Название компании - по убыванию', value: 'name', dir: 0 },
        ],
      }
    }
  },
  computed: {
    token() {
      return window.localStorage.getItem('token') || {}
    },
    rows() {
      return this.items.length
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$axios.post('/get-customers', { token: this.token })
        .then(({ data }) => { this.items = data; this.all = this.items })
        .catch((error) => mutations.setError(error.response.data))

      this.$axios.post('/get-regulars', { token: this.token })
        .then(({ data }) => { this.regulars = data })
        .catch((error) => mutations.setError(error.response.data))
    },
    clone(o) {
      return JSON.parse(JSON.stringify(o))
    },
    hideModal() {
      this.$refs['add-customer'].hide()
    },
    onRowClick(record) {
      this.update = true
      this.error = ''
      this.data = JSON.parse(JSON.stringify(record))
      this.selectedRecord = record
      this.$refs['add-customer'].show()
    },
    onAddSubmit() {
      this.$axios.post('/update-customer', { ...this.data, token: this.token })
        .then(() => {
          Object.keys(this.data).forEach((key) => {
            this.selectedRecord[key] = this.data[key]
          })
          this.selectedRecord = null
        })
        .catch((error) => mutations.setError(error.response.data))
    },
    getRegulars(value) {
      if (value) {
        this.items = this.regulars.map(e => ({...e, final_sum: e.final_sum - e.paid}))
        this.fields.push({
          key: 'num_deals',
          label: 'К-во сделок'
        },
        {
          key: 'amount',
          label: 'Общая сумма заказов'
        },
        {
          key: 'deal_date',
          label: 'Последняя сделка'
        })
      }
      else {
        this.items = this.all
        this.fields.splice(7, 3)
      }
    },
    filterSearch() {
      this.$axios.post('/filter-query', {...this.extra, table: 'customers', handler: 'customers', token: this.token })
      .then(({data}) => {
        this.all = data
        if (!this.showRegulars) this.items = this.all
      })
      .catch((error) => mutations.setError(error.response.data))
      
      this.$axios.post('/filter-query', {...this.extra, table: 'customers', handler: 'customers', method: 'Regulars', token: this.token })
      .then(({data}) => {
        this.regulars = data
        if (this.showRegulars) this.items = this.regulars
      })
      .catch((error) => mutations.setError(error.response.data))
  }
  }
}
</script>

<style scoped>

.customer-sub-controls {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  width: 100%;
}
.customer-sub-controls > div {
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
}
.customer-sub-controls-confirm {
  display: flex;
}
.customer-controls {
  display: flex;
}
.customer-main-controls {
  display: flex;
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
  flex-direction: column;
}
.customer-controls-checkbox {
  width: 300px;
  margin-left: 1em;
}
.customer-controls-date {
  /*width: 880px;*/
  margin-right: 1em;
}
.customer-controls-date input {
  height: calc(1.5em + 0.75rem + 2px);
}
.customer-controls-search {
  margin-right: 1em;
}
.customer-controls-select {
  width: 450px;
  margin-left: 1em;
  margin-right: 1em;
}
.customer-controls-sort {
  width: 350px;
}
h1 {
  margin-bottom: 1em;
}
.customer-controls {
  display: flex;
}
.add-customer-form > * {
  margin-bottom: 1em;
}
.add-customer-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
}
.add-customer-buttons button {
  margin-left: 1em;
}
</style>