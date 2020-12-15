<template>
  <div>
    <h1>Планы</h1>
    <div class="event-controls">
      <div class="event-main-controls">
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
        </b-pagination>
        <b-button class="event-controls-add" variant="primary" @click="showModal">Добавить договор</b-button>
      </div>
      <div class="event-sub-controls">
        <date-picker 
          class="event-controls-date" 
          v-model="extra.filterDate" 
          placeholder="Выберите период" 
          range type="date" 
          valueType="format" 
          format="DD.MM.YYYY"
        />
        <v-select class="event-controls-sort" v-model="extra.sortField" :options="extra.sortFields" label="key" placeholder="Сортировать по"/>
        <div class="event-sub-controls-confirm">
          <v-select class="event-controls-select" v-model="extra.searchField" :options="extra.searchFields" label="key" placeholder="Поиск по"/>
          <b-input v-model="extra.search" class="event-controls-search" placeholder="Поиск"/>
          <b-button class="event-controls-filter" variant="primary" @click="filterSearch">Применить</b-button>
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
    
    <b-modal ref="add-event" hide-footer title="Добавить чек">
      <form class="add-event-form" @submit.prevent="onAddSubmit">
        <div class="add-event-date">
          <label>Дата события:</label>
          <date-picker v-model="data.date" type="datetime" valueType="format" format="DD.MM.YYYY HH:mm"/>
        </div>
        <b-textarea v-model="data.description" placeholder="Описание события" rows="3"/>
        <v-select v-model="data.selected" :options="workers" label="name" placeholder="Нет ответственного"/>

        <div class="add-event-buttons">
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
        date: '',
        description: '',
        selected: null,
      },
      workers: [],
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
          key: 'date',
          label: 'Дата'
        },
        {
          key: 'description',
          label: 'Описание',
        },
        {
          key: 'responsible_id',
          label: 'Ответственный'
        },
        {
          key: 'delete',
          label: ''
        }
      ],
      extra: {
        filterDate: '',
        search: '',
        searchField: '',
        searchFields: [{ key: 'Ответственный', value: 'responsible_id' }, { key: 'Описание', value: 'description' }],
        sortField: '',
        sortFields: [
          { key: 'Дата - по возрастнию', value: 'date', dir: 1 }, 
          { key: 'Дата - по убыванию', value: 'date', dir: 0 }
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
    this.$axios.post('/get-events', { token: this.token })
      .then(({ data }) => this.items = data)
      .catch((error) => console.log(error))

    this.$axios.post('/get-workers', { token: this.token })
      .then(({ data }) => this.workers = data)
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
      this.$refs['add-event'].show()
    },
    hideModal() {
      this.$refs['add-event'].hide()
    },
    formatDate(date) {
      const dateTime = date.split(' ')
      const parts = dateTime[0].split('.')
      return `${parts[2]}-${parts[1]}-${parts[0]} ${dateTime[1]}`
    },
    onAddSubmit() {
      const fixedDate = this.formatDate(this.data.date)
      if (!this.update) {
        this.$axios.post('/add-event', { ...this.data, date: fixedDate, token: this.token })
          .then(() => console.log('success'))
          .catch((error) => console.log(error))
        return
      }

      this.$axios.post('/update-event', { ...this.data, date: fixedDate, token: this.token })
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
      this.data.selected = this.workers.find(o => o.id == this.data.responsible_id)
      this.selectedRecord = record
      this.$refs['add-event'].show()
    },
    deleteService(id) {
      for (let i = 0; i < this.items.length; i++) {
        if (id == this.items[i].id) {
          this.$axios.post('/delete-event', { ...this.items[i], token: this.token })
            .then(() => {
              this.items.splice(i, 1)
            })
            .catch((error) => console.log(error))
          break
        }
      }
    },
    filterSearch() {
      this.$axios.post('/filter-query', {...this.extra, table: 'events', handler: 'events', token: this.token })
      .then(({data}) => {
        this.items = data
      })
      .catch((error) => console.log(error))
    }
  }
}
</script>

<style scoped>

.event-sub-controls {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  width: 100%;
}
.event-sub-controls > div {
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
}
.event-sub-controls-confirm {
  display: flex;
}
.event-controls {
  display: flex;
}
.event-main-controls {
  display: flex;
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 1rem;
  flex-direction: column;
}
.event-controls-checkbox {
  /*width: 750px;*/
  margin-right: 1em;
}
.event-controls-date {
  width: 200px;
  margin-right: 1em;
}
.event-controls-date input {
  height: calc(1.5em + 0.75rem + 2px);
}
.event-controls-search {
  margin-right: 1em;
}
.event-controls-select {
  width: 400px;
  margin-left: 1em;
  margin-right: 1em;
}
.event-controls-sort {
  width: 250px;
}
h1 {
  margin-bottom: 1em;
}
.add-event-modal {
  display: flex;
}
.add-event-form {
  flex: 1;
}
.add-event-form > *{
  margin-bottom: 1em;
}
.add-event-services {
  width: 45%;
  padding-left: 2em;
}
.add-event-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
}
.add-event-buttons button {
  margin-left: 1em;
}
.add-event-date {
  display: flex;
  justify-content: space-between;
}
.event-controls {
  display: flex;
}
.event-controls button {
  margin-bottom: 1rem;
  min-width: 200px;
  height: calc(1.5em + 0.75rem + 2px);
  justify-self: flex-end;
}
a {
  cursor: pointer!important;
}
a:hover {
  color: blue!important;
}
</style>