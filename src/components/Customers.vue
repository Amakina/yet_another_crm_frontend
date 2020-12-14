<template>
  <div>
    <h1>Заказчики</h1>
    <div class="customer-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
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
      rows: 0,
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
        .catch((error) => console.log(error))
    },
  }
}
</script>

<style scoped>
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