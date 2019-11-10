<template>
  <v-layout column justify-center wrap>
    <v-flex xs12>
      <v-flex v-if="error">
        <v-alert
          :value="true"
          type="error"
          @click="error=!error"
        >
          {{ error }}
        </v-alert>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-title>
            <span class="title font-weight-bold">Заказы</span>
            <v-spacer />
            <DialogForEditUsers
              :status="dialogForEditItem"
              :item="itemForEdit"
              :edited-index="editedIndexForItem"
              @close="closeDialogForItem"
            />
          </v-card-title>
          <v-card-text>
            <TableForOrders
              @edit-order="editOrder"
            />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Items',
  layout: 'dashboard',
  components: {
    DialogForEditUsers: () => import('../../components/DialogForEditItems'),
    TableForOrders: () => import('../../components/orders/TableForOrders')
  },
  data () {
    return {
      dialogForEditItem: false,
      itemForEdit: {
        email: '',
        name: '',
        rest: []
      },
      editedIndexForItem: -1,
      error: undefined
    }
  },
  computed: {
    items () {
      return this.$store.getters.getItems
    }
  },
  fetch ({ store, params }) {
    store.dispatch('getOrders')
    store.dispatch('getItems')
    store.dispatch('getCategories')
  },
  methods: {
    editOrder (item) {
      this.editedIndexForItem = this.items.indexOf(item)
      this.itemForEdit = item
      this.dialogForEditItem = true
    },
    closeDialogForItem () {
      this.dialogForEditItem = false
      this.editedIndexForItem = -1
      this.itemForEdit = {
        email: '',
        name: '',
        rest: []
      }
    }
  }
}
</script>
