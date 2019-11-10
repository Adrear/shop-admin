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
            <span class="title font-weight-bold">Manage Items</span>
            <v-spacer />
            <DialogForEditUsers
              :status="dialogForEditItem"
              :item="itemForEdit"
              :edited-index="editedIndexForItem"
              @close="closeDialogForItem"
            />
          </v-card-title>
          <v-card-text>
            <TableForUsers
              @edit-user="editItem"
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
    TableForUsers: () => import('../../components/TableForItems')
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
    store.dispatch('getItems')
    store.dispatch('getCategories')
  },
  methods: {
    editItem (item) {
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
