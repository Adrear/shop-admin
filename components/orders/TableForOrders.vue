<template>
  <v-data-table
    :headers="headers"
    :items="items"
  >
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="goto(item.id)"
      >
        arrow_right_alt
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'TableForUsers',
  data () {
    return {
    }
  },
  computed: {
    headers () {
      return [
        { text: 'ID', value: 'id' },
        { text: 'Дата', value: 'date' },
        { text: 'Сумма', value: 'price' },
        { text: 'Имя', value: 'name' },
        { text: 'Статус заказа', value: 'order_status' },
        { text: 'Статус оплаты', value: 'pay_status' },
        { text: 'Действия', sortable: false, value: 'action' }
      ]
    },
    items () {
      return this.$store.state.orders
    }
  },
  methods: {
    goto (id) {
      this.$router.push(`orders/${id}`)
    }
  }
}
</script>
