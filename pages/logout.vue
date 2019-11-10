<template>
  <v-layout>
    <v-flex text-xs-center>
      {{ text }}
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data () {
    return {
      text: ''
    }
  },
  async mounted () {
    await this.$store.dispatch('signOut')
    await setTimeout(this.$router.push('/login'), 1000)
  }
}
</script>
