<template>
  <v-data-table
    :headers="headers"
    :items="items"
  >
    <template v-slot:item.images="{ item }">
      <v-flex>
        {{ item.images ? item.images.length : 0 }}
      </v-flex>
    </template>
    <template v-slot:item.available="{ item }">
      <v-checkbox
        v-model="item.available"
        readonly
        color="success"
      />
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="edit(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import * as itemsAPI from '~/api/items.js'

export default {
  name: 'TableForUsers',
  data () {
    return {
    }
  },
  computed: {
    headers () {
      return [
        { text: 'Name', align: 'left', sortable: true, value: 'name' },
        { text: 'Available', align: 'left', sortable: true, value: 'available' },
        { text: 'Category', align: 'left', sortable: true, value: 'categoryName' },
        { text: 'SubCategory', align: 'left', sortable: true, value: 'categorySubName' },
        { text: 'Images', align: 'left', sortable: true, value: 'images' },
        { text: 'Actions', align: 'left', value: 'action' }
      ]
    },
    items () {
      return this.$store.getters.getItems
    }
  },
  methods: {
    edit (item) {
      this.$emit('edit-user', item)
    },
    async deleteItem (item) {
      const id = item.id
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await itemsAPI.deleteItem(id)
          await this.$store.commit('DELETE_ITEM', item)
        } catch (e) { this.error = e }
      }
    },
    initialize () {
      this.$store.dispatch('getItems')
    }
  }
}
</script>
