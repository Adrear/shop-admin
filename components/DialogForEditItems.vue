<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn text small v-on="on">
        create new
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn dark text @click="save">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-flex v-if="error">
          <v-alert
            :value="true"
            type="error"
            @click="error=!error"
          >
            {{ error }}
          </v-alert>
        </v-flex>
        <v-layout wrap>
          <v-flex xs12 md6 pa-3>
            <v-text-field
              v-model="newItem.name"
              label="Name"
            />
            <v-checkbox
              v-model="newItem.available"
              label="Available"
              color="success"
            />
            <v-textarea
              v-model="newItem.description"
              label="Description"
            />
          </v-flex>
          <v-flex xs12 md6 pa-3>
            <v-text-field
              v-model="newItem.price"
              label="Price"
            />
            <v-text-field
              v-model="newItem.stock_quantity"
              label="Quantity"
            />
            <v-text-field
              v-model="newItem.vendor"
              label="Vendor"
            />
            <v-select
              v-model="newItem.categoryName"
              placeholder="Select Category"
              :items="cats"
            />
            <v-select
              v-model="newItem.categorySubName"
              placeholder="Select SubCategory"
              :items="subcats"
            />
          </v-flex>
        </v-layout>
        <v-layout>
          <template v-for="(param, i) in params">
            <v-flex :key="i" pa-2>
              <v-text-field
                v-model="newItem.params[param]"
                :label="param"
              />
            </v-flex>
          </template>
        </v-layout>
        <v-layout>
          <template v-for="(image, i) in newItem.images">
            <v-flex :key="i">
              <v-img :src="image" width="100" height="100" />
              <v-icon @click="deleteImage(image, i)">
                delete
              </v-icon>
            </v-flex>
          </template>
        </v-layout>
        <vue-dropzone id="drop1" ref="dropzone" :options="dropOptions" @vdropzone-removed-file="removedFile" @vdropzone-complete="afterComplete" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash'
import vueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import * as itemsAPI from '~/api/items.js'

export default {
  name: 'DialogForEditItems',
  components: {
    vueDropzone
  },
  props: {
    status: {
      type: Boolean,
      default: () => false
    },
    item: {
      type: Object,
      default: () => {
      }
    },
    editedIndex: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      dialog: false,
      error: undefined,
      newItem: {
        description: '',
        name: '',
        price: '',
        stock_quantity: '',
        categoryId: '',
        categoryName: '',
        categorySubId: '',
        categorySubName: '',
        vendor: 'AdVitam',
        available: false,
        images: [],
        params: {
          'материал': '',
          'цвет': '',
          'стиль': '',
          'размер': ''
        }
      },
      resNewItem: {
        description: '',
        name: '',
        price: '',
        stock_quantity: '',
        categoryId: '',
        categoryName: '',
        categorySubId: '',
        categorySubName: '',
        vendor: 'AdVitam',
        available: false,
        images: [],
        params: {
          'материал': '',
          'цвет': '',
          'стиль': '',
          'размер': ''
        }
      },
      uploadImages: [],
      dropOptions: {
        url: 'https://httpbin.org/post',
        maxFilesize: 10, // MB
        maxFiles: 10,
        addRemoveLinks: true
      },
      rules: {
        requiredName: v => !!v || 'Name is required',
        requiredPassword: v => !!v || 'Password is required',
        requiredEmail: v => !!v || 'E-mail is required',
        min: v => (v && v.length >= 8) || 'Min 8 characters',
        max: v => (v && v.length <= 30) || 'Name must be less than 30 characters',
        emailValid: v => /.+@.+/.test(v) || 'E-mail must be valid'
      }
    }
  },
  computed: {
    title () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    subCategories () {
      return this.$store.getters.getSubCategories
    },
    categories () {
      return this.$store.getters.getCategories
    },
    cats () {
      return this.categories.map(el => el.name)
    },
    subcats () {
      const cat = this.categories.find(el => el.name === this.newItem.categoryName)
      if (cat && cat.children) {
        return cat.children.map(el => el.name)
      }
      return []
    },
    params () {
      const cat = this.categories.find(el => el.name === this.newItem.categoryName)
      if (cat && cat.children) {
        const subcat = cat.children.find(el => el.name === this.newItem.categorySubName)
        if (subcat && subcat.children) {
          console.log(subcat)
          return subcat.children.map(el => el.name)
        }
      }
      return []
    }
  },
  watch: {
    item (val) {
      this.newItem = _.clone(val)
    },
    status (val) {
      this.dialog = val
    }
  },
  methods: {
    async save () {
      try {
        this.categories.forEach((category) => {
          category.children.forEach((subCategory) => {
            if (subCategory.name === this.newItem.categorySubName) {
              this.newItem.categorySubId = subCategory.id
              this.newItem.categoryName = category.name
              this.newItem.categoryId = category.id
            }
          })
        })
        if (this.editedIndex > -1) {
          const getRefs = async () => {
            try {
              return await Promise.all(this.uploadImages.map(item => itemsAPI.uploadImage(this.newItem.id, item)))
            } catch (e) {
              console.log(e)
            }
          }
          const refs = await getRefs()
          this.newItem.images = (this.newItem.images || []).concat(refs)
          await itemsAPI.updateItem(this.newItem)
          await this.$store.commit('EDIT_ITEM', [this.editedIndex, this.newItem])
        } else {
          await itemsAPI.createNewItem(this.newItem)
          await this.$store.commit('ADD_ITEM', this.newItem)
        }
        this.close()
      } catch (e) { this.error = e }
    },
    close () {
      try {
        this.$refs.dropzone.removeAllFiles()
        this.newItem = Object.assign({}, this.resNewItem)
        this.dialog = false
        this.$emit('close')
      } catch (e) {
        this.error = e
      }
    },
    afterComplete (file) {
      this.uploadImages.push({
        data: file.dataURL,
        name: file.upload.uuid,
        type: file.type.slice(6)
      })
    },
    removedFile (file) {
      this.uploadImages = this.uploadImages.filter(el => el.name !== file.upload.uuid)
    },
    deleteImage (image, i) {
      this.newItem.images.splice(i, 1)
    }
  }
}
</script>
