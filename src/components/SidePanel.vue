<template>
  <aside class="side-panel">
    <b-icon icon="cart4" variant="primary" @click="onButtonClick('services')"></b-icon>
    <b-icon icon="file-earmark-check" variant="primary" @click="onButtonClick('deals')"></b-icon>
    <b-icon icon="credit-card" variant="primary" @click="onButtonClick('payments')"></b-icon>
    <b-icon icon="calendar-event" variant="primary" @click="onButtonClick('events')"></b-icon>
    <b-icon icon="people" variant="primary" @click="onButtonClick('customers')"></b-icon>
  </aside>
</template>

<script>
export default {
  methods: {
    onButtonClick(button) {
      this.$emit('panel-changed', button)
    }
  }
}
</script>

<style scoped>
.side-panel {
  position: absolute;
  left: 0;
  top: 0;
  width: 86px;
  height: 100vh;
  padding: 1em;
  color: white;
  border-right: 1px solid black;
}
.side-panel > svg {
  width: 50px;
  height: 50px;
  margin-top: 2em;
  cursor: pointer;
}
.side-panel > svg:hover {
  fill:blue;
}
</style>