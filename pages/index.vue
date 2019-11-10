<template>
  <v-layout column justify-center wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title class="headline">
          Добро пожаловать в админ панель Advitam
        </v-card-title>
        <v-card-text>
          Обновление xml файла для розетки
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            nuxt
            target="_blank"
            href="https://advitamwear.com/api/generateRozetkaXML"
          >
            Обновить
          </v-btn>
          <a class="ml-2" href="https://advitamwear.com/static/AdvitamRozetka.xml" target="_blank">
            Файл
          </a>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Dashboard',
  layout: 'dashboard',
  data () {
    return {

    }
  }
}
</script>
