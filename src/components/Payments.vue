<template>
  <div>
    <h1>Подтверждение оплаты</h1>
    <b-button variant="primary" @click="showModal">Добавить чек</b-button>
    
    <b-modal ref="add-check" hide-footer title="Добавить чек" size="lg">
      <div class="add-check-modal">
        <form class="add-check-form" @submit.prevent="onAddSubmit">
          <b-input v-model="data.customer_name" placeholder="Ф.И.О. заказчика" />
          <b-input v-model="data.customer_ogrn" placeholder="ОГРН заказчика" />
          <b-input v-model="data.customer_inn" placeholder="ИНН заказчика" />
          <b-input v-model="data.customer_address" placeholder="Адрес заказчика" />
          <b-input v-model="data.customer_phone" placeholder="Телефон заказчика" />
          <b-input v-model="data.customer_email" placeholder="Email заказчика" />
          <!--<b-input v-model="data.customer_bank" placeholder="Банк, выпустивший карту" />
          <b-input v-model="data.customer_bic" placeholder="БИК" />
          <b-input v-model="data.customer_bank_acc" placeholder="Банковский счет" />-->
          <b-select v-model="selected" :options="options"/>
          <b-input placeholder="Дата заключения договора" />
          <b-input placeholder="Дата завершения работ" />

          <div class="add-check-buttons">
            <b-button type="confirm" variant="primary" @click="hideModal">Добавить</b-button>
            <b-button type="reset" variant="primary" @click="hideModal">Отмена</b-button>
          </div>
        </form>
        <div class="add-check-services">
          <h5>Список оказываемых услуг</h5>
        </div>
      </div>
  </b-modal>
  </div>
</template>


<script>
export default {
  data() {
    return {
      data: {
        customer_name: '',
        customer_ogrn: '',
        customer_inn: '',
        customer_address: '',
        customer_phone: '',
        customer_email: '',
        customer_bank: '',
        customer_bic: '',
        customer_bank_acc: '',
      },
      selected: null,
      options: [
        { value: null, text: 'Please select an option' },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ]
    }
  },
  methods: {
    showModal() {
      this.$refs['add-deal'].show()
    },
    hideModal() {
      this.$refs['add-deal'].hide()
    },
    onAddSubmit() {

    }
  }
}
</script>

<style scoped>
.add-deal-modal {
  display: flex;
}
.add-deal-form {
  flex: 1;
}
.add-deal-form > *{
  margin-bottom: 1em;
}
.add-deal-services {
  width: 45%;
  padding-left: 2em;
}
.add-deal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
}
.add-deal-buttons button {
  margin-left: 1em;
}
</style>