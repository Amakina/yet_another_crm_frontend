<template>
  <div>
    <h1>Подтверждение оплаты</h1>
    <b-button variant="primary" @click="showModal">Добавить чек</b-button>
    
    <b-modal ref="add-check" hide-footer title="Добавить чек">
      <form class="add-check-form" @submit.prevent="onAddSubmit">
        <b-select v-model="selected" :options="options" />
        <b-input v-model="data.check" placeholder="Номер чека"/>
        <b-input v-model="data.date" placeholder="Дата совершения оплаты"/>
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
        deal_id: '',
        check: '',
        date: '',
        sum: '',
      },
      selected: null,
      options: [
        { value: null, text: 'Выберите договор' },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ]
    }
  },
  methods: {
    showModal() {
      this.$refs['add-check'].show()
    },
    hideModal() {
      this.$refs['add-check'].hide()
    },
    onAddSubmit() {

    }
  }
}
</script>

<style scoped>
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
</style>