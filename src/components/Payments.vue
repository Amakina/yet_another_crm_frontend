<template>
  <div>
    <h1>Подтверждение оплаты</h1>
    <div class="payment-controls">
      <div class="payment-main-controls">
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
        </b-pagination>
        <b-button class="payment-controls-add" variant="primary" @click="showModal">Добавить чек</b-button>
      </div>
      <div class="payment-sub-controls">
        <v-select class="payment-controls-sort" v-model="extra.sortField" :options="extra.sortFields" label="key" placeholder="Сортировать по"/>
        <div class="payment-sub-controls-confirm">
          <v-select class="payment-controls-select" v-model="extra.searchField" :options="extra.searchFields" label="key" placeholder="Поиск по"/>
          <b-input v-model="extra.search" class="payment-controls-search" placeholder="Поиск"/>
          <b-button class="payment-controls-filter" variant="primary" @click="filterSearch">Применить</b-button>
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
    
    <b-modal ref="add-check" hide-footer title="Добавить чек">
      <form class="add-check-form" @submit.prevent="onAddSubmit">
        <v-select v-model="data.selected" :options="options" label="deal_id" placeholder="Выберите договор" />
        <b-input v-model="data.receipt" placeholder="Номер чека"/>
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
        receipt: '',
        date: '',
        sum: '',
      },
      options: [],
      fields: [
        {
          key: 'id',
          label: 'ID'
        },
        {
          key: 'deal_id',
          label: 'Номер договора'
        },
        {
          key: 'receipt',
          label: 'Номер чека',
        },
        {
          key: 'date',
          label: 'Дата выдачи чека'
        },
        {
          key: 'sum',
          lebel: 'Сумма оплаты',
        }, 
        {
          key: 'delete',
          label: ''
        }
      ],
      busy: true,
      currentPage: 1,
      rows: 0,
      perPage: 5,
      items: [],
      extra: {
        search: '',
        searchField: '',
        searchFields: [{ key: '№ договора', value: 'deal_id' }, { key: '№ чека', value: 'receipt' }],
        sortField: '',
        sortFields: [
          { key: '№ договора - по возрастнию', value: 'deal_id', dir: 1 }, 
          { key: '№ договора - по убыванию', value: 'deal_id', dir: 0 }, 
          { key: 'Сумма - по возрастанию', value: 'sum', dir: 1 }, 
          { key: 'Сумма - по убыванию', value: 'sum', dir: 0 }
        ],
      }
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
    .then(({ data }) =>  this.options = data.filter(d => d.id && !d.service_name))
    .catch((error) => console.log(error))
  },
  methods: {
    resetData() {
      this.data = {
        code: '',
        name: '',
        description: '',
        price: 0.0,
      }
      this.update = false
      this.error = ''
    },
    showModal() {
      this.resetData()
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
      if (!this.update) {
        this.$axios.post('/add-payment', { ...this.data, date: fixedDate, token: this.token })
          .then(() => {
            this.items.push({ ...this.data, deal_id: this.data.selected.deal_id })
          })
          .catch((error) => console.log(error))
        return
      }

      this.$axios.post('/update-payment', { ...this.data, date: fixedDate, token: this.token })
          .then(() => {
            Object.keys(this.data).forEach((key) => {
              this.selectedRecord[key] = this.data[key]
            })
            this.selectedRecord = null
          })
          .catch((error) => console.log(error))
    },
    onRowClick(record) {
      this.update = true
      this.error = ''
      this.data = JSON.parse(JSON.stringify(record))
      this.data.selected = this.options.find(o => o.id == this.data.deal_id)
      this.selectedRecord = record
      this.$refs['add-check'].show()
    },
    deleteService(id) {
      for (let i = 0; i < this.items.length; i++) {
        if (id == this.items[i].id) {
          this.$axios.post('/delete-payments', { ...this.items[i], token: this.token })
            .then(() => {
              this.items.splice(i, 1)
            })
            .catch((error) => console.log(error))
          break
        }
      }
    },
    filterSearch() {
      this.$axios.post('/filter-query', {...this.extra, table: 'payments', handler: 'payments', token: this.token })
      .then(({data}) => {
        this.items = data
      })
      .catch((error) => console.log(error))
    }
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 1em;
}
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
a {
  cursor: pointer!important;
}
a:hover {
  color: blue!important;
}
.payment-sub-controls {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  width:100%;
}
.payment-sub-controls > div {
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
}
.payment-sub-controls-confirm {
  display: flex;
}
.payment-controls {
  display: flex;
}
.payment-main-controls {
  display: flex;
  margin-bottom: 1rem;
  flex-direction: column;
}
.payment-controls-checkbox {
  /*width: 750px;*/
  margin-right: 1em;
}
.payment-controls-date {
  /*width: 880px;*/
  margin-right: 1em;
}
.payment-controls-date input {
  height: calc(1.5em + 0.75rem + 2px);
}
.payment-controls-search {
  margin-right: 1em;
}
.payment-controls-select {
  width: 350px;
  margin-left: 1em;
  margin-right: 1em;
}
.payment-controls-sort {
  width: 300px;
  margin-left: 1em;
}
</style>