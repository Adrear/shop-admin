<template>
  <v-app light>
    <v-content>
      <v-container grid-list-xl fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>Advitam &copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      fixed: true
    }
  }
}
</script>
