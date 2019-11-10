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
            <span class="title font-weight-bold">Категории</span>
            <v-spacer />
          </v-card-title>
          <v-card-text>
            <v-treeview
              :items="categories"
              open-all
            >
              <template v-slot:append="{ item }">
                <v-icon small @click="deleteItem(item)">
                  delete
                </v-icon>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-flex>
    <v-flex xs12 my-4>
      <v-card>
        <v-card-text>
          <v-layout>
            <v-flex px-4>
              <v-combobox
                v-model="category"
                :items="cats"
                label="Категория"
              />
            </v-flex>
            <v-flex px-4>
              <v-combobox
                v-model="subcategory"
                :items="subcats"
                label="Подкатегория"
              />
            </v-flex>
            <v-flex px-4>
              <v-text-field
                v-model="parameter"
                label="Параметр"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-btn @click="add">
              Добавить
            </v-btn>
            <v-btn class="ml-2" @click="update">
              Обновить
            </v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Categories',
  layout: 'dashboard',
  components: {
  },
  data () {
    return {
      error: undefined,
      category: '',
      subcategory: '',
      parameter: ''
    }
  },
  computed: {
    categories: {
      get () {
        return this.$store.getters.getCategories
      },
      set (newVal) {
        this.$store.dispatch('updateCategories', newVal)
      }
    },
    cats () {
      return this.categories.map(el => el.name)
    },
    subcats () {
      const cat = this.categories.find(el => el.name === this.category)
      if (cat && cat.children) {
        console.log(cat)
        return cat.children.map(el => el.name)
      }
      return []
    }
  },
  fetch ({ store, params }) {
    store.dispatch('getItems')
    store.dispatch('getCategories')
  },
  methods: {
    update () {
      const items = this.$store.state.items.filter(el => el.available === true)
      const categories = []
      this.$store.state.categories.forEach((cat) => {
        cat.children.forEach((subcat) => {
          categories.push(subcat)
        })
      })
      items.forEach((item) => {
        categories.forEach((cat) => {
          if (cat.name === item.categorySubName) {
            const subcats = cat.children.map(el => el.name)
            if (typeof item.params === 'object') {
              Object.keys(item.params).forEach((param) => {
                if (!subcats.includes(param)) {
                  delete item.params[param]
                }
              })
            }
          }
        })
      })
      console.log(items)
      this.$store.dispatch('newItems', items)
    },
    deleteItem (item) {
      const id = item.id
      const categoriesCopy = this.categories.slice()
      categoriesCopy.forEach((cat, i) => {
        if (cat.id === id) {
          categoriesCopy.splice(i, 1)
          this.$store.dispatch('deleteCategory', cat.uid)
        } else if (cat.children) {
          cat.children.forEach((subcat, j) => {
            if (subcat.id === id) {
              categoriesCopy[i].children.splice(j, 1)
            } else if (subcat.children) {
              subcat.children.forEach((param, k) => {
                if (param.id === id) {
                  categoriesCopy[i].children[j].children.splice(k, 1)
                }
              })
            }
          })
        }
      })
      this.categories = categoriesCopy
    },
    add () {
      const newCategories = this.categories.slice()
      //  add parameter
      if (this.category && this.subcategory && this.parameter && this.subcats.length && this.subcats.find(el => el === this.subcategory)) {
        const index = newCategories.findIndex(el => el.name === this.category)
        const index2 = newCategories[index].children.findIndex(el => el.name === this.subcategory)
        const id2 = newCategories[index].children[index2].id
        if (!newCategories[index].children[index2].children) { newCategories[index].children[index2].children = [] }
        const id3 = newCategories[index].children[index2].children.length
        newCategories[index].children[index2].children.push({
          name: this.parameter,
          id: id2 + (id3 < 10 ? '0' + id3 : id3)
        })
      }
      // add subcategory and parameter
      if (this.category && this.subcategory && this.parameter && this.subcats.length && !this.subcats.find(el => el === this.subcategory)) {
        const index = newCategories.findIndex(el => el.name === this.category)
        const id1 = newCategories[index].id
        const id2 = newCategories[index].children.length
        newCategories[index].children.push({
          children: [
            {
              name: this.parameter,
              id: id1 + '0' + id2 + '00'
            }
          ],
          name: this.subcategory,
          id: id1 + '0' + id2
        })
      }
      // add category, subcategory and parameter
      if (this.category && this.subcategory && this.parameter && !this.subcats.length) {
        const id1 = newCategories.length + 1
        newCategories.push({
          name: this.category,
          id: id1,
          children: [
            {
              name: this.subcategory,
              id: id1 + '00',
              children: [
                {
                  name: this.parameter,
                  id: id1 + '0000'
                }
              ]
            }
          ]
        })
      }
      // add category and subcategory
      if (this.category && this.subcategory && !this.parameter && !this.subcats.length) {
        const id1 = newCategories.length + 1
        newCategories.push({
          name: this.category,
          id: id1,
          children: [
            {
              name: this.subcategory,
              children: [],
              id: id1 + '00'
            }
          ]
        })
      }
      // add subcategory
      if (this.category && this.subcategory && !this.parameter && this.subcats.length) {
        const index = newCategories.findIndex(el => el.name === this.category)
        const id1 = newCategories[index].id
        const id2 = newCategories[index].children.length
        newCategories[index].children.push({
          children: [],
          name: this.subcategory,
          id: id1 + '0' + id2
        })
      }
      // add category
      if (this.category && !this.subcategory && !this.subcats.length) {
        const id1 = newCategories.length + 1
        newCategories.push({
          name: this.category,
          id: id1,
          children: []
        })
      }
      this.categories = newCategories
    }
  }
}
</script>
