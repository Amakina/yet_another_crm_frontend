<template>
  <div class="control-panel">
    <side-panel @panel-changed="onPanelChange"/>
    <div class="main-content">
      <services v-if="panels.services" />
      <deals v-if="panels.deals" />
      <payments v-if="panels.payments"  />
      <events v-if="panels.events"  />
      <customers v-if="panels.customers"  />
    </div>
  </div>
</template>

<script>
import SidePanel from '../components/SidePanel'
import Services from '../components/Services'
import Deals from '../components/Deals'
import Payments from '../components/Payments'
import Events from '../components/Events'
import Customers from '../components/Customers'

export default {
  components: {
    SidePanel,
    Services,
    Deals,
    Payments,
    Events,
    Customers
  },
  data() {
    return {
      currentPanel: 'services',
      panels: {
        services: true,
        deals: false,
        payments: false,
        events: false,
        customers: false,
      }
    }
  },
  methods: {
    onPanelChange(panel) {
      this.panels[this.currentPanel] = false
      this.currentPanel = panel
      this.panels[panel] = true
    }
  }
}
</script>

<style scoped>
.control-panel {
  position: relative;
  border-top: 2px solid #dee2e6;
}
.main-content {
  margin-left: 100px;
  margin: 30px 50px 0px 150px;
}
</style>