<template>
  <div>
    <h1>Услуги</h1>
    <div class="services-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
      <b-button variant="primary" @click="showModal">Добавить услугу</b-button>
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
      <template #cell(index)="data">
        <div>{{data.index + (currentPage - 1) * perPage + 1}}</div>
      </template>
      <template #cell(delete)="data">
        <a @click="deleteService(data.item.id)">Удалить</a>
      </template>
    </b-table>

    <b-modal ref="add-services" hide-footer :title="modal.title">
      <form class="add-services-modal" @submit.prevent="onAddSubmit">
        <b-input v-model="data.code" placeholder="Код услуги" maxlength="10"/>
        <b-input v-model="data.name" placeholder="Название услуги" maxlength="100"/>
        <b-textarea v-model="data.description" placeholder="Описание услуги" rows="4"/>
        <b-input v-model="data.price" type="number" placeholder="Цена" />
        <div class="add-services-buttons">
        <b-button type="confirm" variant="primary" @click="hideModal">{{modal.button}}</b-button>
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
      busy: true,
      currentPage: 1,
      perPage: 7,
      data: {
        code: '',
        name: '',
        description: '',
        price: 0.0,
      },
      items: [],
      fields: [
          {
            key: 'index',
            label: '№'
          },
          {
            key: 'code',
            label: 'Код'
          },
          {
            key: 'name',
            label: 'Название',
          },
          {
            key: 'description',
            label: 'Описание'
          },
          {
            key: 'price',
            lebel: 'Цена',
          }, 
          {
            key: 'delete',
            label: ''
          }
        ],
      selectedRecord: null,
      update: false,
      error: ''
    }
  },
  computed: {
    token() {
      return window.localStorage.getItem('token') || {}
    },
    modal() {
      return {
        button: this.update ? 'Обновить' : 'Добавить',
        title: this.update ? 'Обновить услугу' : 'Добавить услугу',
      }
    },
    rows() {
      return this.items.length
    }
  },
  mounted() {
    this.busy = true
    this.$axios.post('/get-services', { token: this.token })
      .then(({ data }) => {
        this.items = data
        this.busy = false
      })
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
      this.$refs['add-services'].show()
    },
    hideModal() {
      this.$refs['add-services'].hide()
    },
    onAddSubmit() {
      if (!this.update) {
        this.$axios.post('/add-service', { ...this.data, token: this.token })
          .then(() => {
            this.items.push(this.data)
          })
          .catch((error) => console.log(error))
        return
      }
      
      this.$axios.post('/update-service', { ...this.data, token: this.token })
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
      this.selectedRecord = record
      this.$refs['add-services'].show()
    },
    deleteService(id) {
      for (let i = 0; i < this.items.length; i++) {
        if (id == this.items[i].id) {
          this.$axios.post('/delete-service', { ...this.items[i], token: this.token })
            .then(() => {
              this.items.splice(i, 1)
            })
            .catch((error) => console.log(error))
          break
        }
      }
    }
  }
}
</script>

<style scoped>
.services-controls {
  width: 100%;
  display: flex;
}
h1 {
  margin-bottom: 1em;
}
.services-controls button {
  margin-bottom: 1rem;
  min-width: 150px;
  height: calc(1.5em + 0.75rem + 2px);
  justify-self: flex-end;
}
.add-services-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
}
.add-services-modal input, .add-services-modal textarea {
  margin-bottom: 1em;
}
.add-services-modal button {
  margin-left: 1em;
}
a {
  cursor: pointer!important;
}
a:hover {
  color: blue!important;
}
</style>