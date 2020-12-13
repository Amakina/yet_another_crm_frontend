<template>
  <div>
    <h1>Услуги</h1>
    <div class="services-controls">
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
      </b-pagination>
      <b-input placeholder="Поиск"/>
      <b-button variant="primary" @click="showModal">Добавить услугу</b-button>
    </div>
    <b-table striped hover :items="items" :per-page="perPage" :current-page="currentPage"></b-table>


    <b-modal ref="add-services" hide-footer title="Добавить услугу">
      <form class="add-services-modal" @submit.prevent="onAddSubmit">
        <b-input v-model="data.code" placeholder="Код услуги" maxlength="10"/>
        <b-input v-model="data.name" placeholder="Название услуги" maxlength="100"/>
        <b-textarea v-model="data.description" placeholder="Описание услуги" rows="4"/>
        <b-input v-model="data.price" type="number" placeholder="Цена" />
        <div class="add-services-buttons">
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
      currentPage: 1,
      rows: 7,
      perPage: 5,
      data: {
        code: '',
        name: '',
        description: '',
        price: 0.0,
      },
      items: [
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        },
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        },
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        },
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        },
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        },
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        },
        {
          id: 1,
          code: "A1234B",
          name: "Установка смесителя",
          description: "Описание"
        }
      ]
    }
  },
  methods: {
    showModal() {
      this.$refs['add-services'].show()
    },
    hideModal() {
      this.$refs['add-services'].hide()
    },
    onAddSubmit() {

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
</style>