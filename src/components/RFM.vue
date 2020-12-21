<template>
  <div>
    <h1>Анализ</h1>
    <div class="customer-controls">
      <div class="customer-main-controls">
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
        </b-pagination>
      </div>
    </div>
    <b-table 
      striped 
      hover 
      :items="items"  
      :fields="fields"
      :per-page="perPage" 
      :current-page="currentPage" 
      :busy="busy"
    >
    </b-table>
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
      perPage: 10,
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
          key: 'phone',
          lebel: 'Телефон',
        }, 
        {
          key: 'email',
          lebel: 'E-mail',
        },
        {
          key: 'date_diff',
          label: 'Последний заказ (R)'
        },
        {
          key: 'frequency',
          label: 'Число заказов (F)'
        },
        {
          key: 'money',
          label: 'Средняя сумма (M)'
        },
        {
          key: 'overall',
          label: 'Рейтинг RFM',
          sortable: true
        },
        {
          key: 'shareRevenue',
          label: 'Выручка'
        },
        {
          key: 'shareMean',
          label: 'Средняя сумма'
        },
        {
          key: 'shareProfit',
          label: 'Прибыль'
        },
        {
          key: 'overallABC',
          label: 'Рейтинг ABC',
          sortable: true
        },
      ],
      rmf: [],
      abc: [],
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
      this.$axios.post('/get-rfm', { token: this.token })
        .then(({ data }) => { 
          this.items = data
          this.$axios.post('/get-abc', { token: this.token })
            .then(({ data }) => { 
              this.items = this.items.map(item => ({ ...item, ...data.find(v => v.id === item.id)}))
              this.busy = false 
            })
            .catch((error) => mutations.setError(error.response.data))
        })
        .catch((error) => mutations.setError(error.response.data))

    },
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