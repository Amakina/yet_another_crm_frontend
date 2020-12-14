<template>
  <div>
    <h1>Планы</h1>
    <div class="event-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
      <b-button variant="primary" @click="showModal">Добавить событие</b-button>
    </div>
    <b-table striped hover :items="items" :per-page="perPage" :current-page="currentPage"></b-table>
    
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
      items: []
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
    showModal() {
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
      this.$axios.post('/add-event', { ...this.data, date: fixedDate, token: this.token })
        .then(() => console.log('success'))
        .catch((error) => console.log(error))
    }
  }
}
</script>

<style scoped>
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
</style>