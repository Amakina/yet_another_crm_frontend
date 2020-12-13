<template>
  <div>
    <h1>Планы</h1>
    <b-button variant="primary" @click="showModal">Добавить событие</b-button>
    
    <b-modal ref="add-event" hide-footer title="Добавить чек">
      <form class="add-event-form" @submit.prevent="onAddSubmit">
        <date-picker v-model="data.date" type="datetime" valueType="format" format="DD.MM.YYYY hh:mm"/>
        <b-textarea v-model="data.description" placeholder="Описание события" rows="3"/>

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
      },
    }
  },
  methods: {
    showModal() {
      this.$refs['add-event'].show()
    },
    hideModal() {
      this.$refs['add-event'].hide()
    },
    onAddSubmit() {

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
</style>