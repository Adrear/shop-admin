<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs6>
      <v-flex
        v-if="error"
        style="cursor: pointer"
        @click="error = !error"
      >
        <v-alert
          type="error"
        >
          {{ error }}
        </v-alert>
      </v-flex>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="email"
          :rules="[rules.emailValid, rules.max, rules.requiredEmail]"
          label="E-mail"
          required
          @keyup.enter="login"
        />
        <v-text-field
          v-model="password"
          :append-icon="show ? 'visibility_off' : 'visibility'"
          :rules="[rules.requiredName, rules.min]"
          :type="show ? 'text' : 'password'"
          label="Password"
          autocomplete="new-password"
          hint="At least 8 characters"
          class="input-group--focused"
          @click:append="show = !show"
          @keyup.enter="login"
        />
        <v-btn
          :disabled="!valid || email === '' || password === ''"
          color="success"
          @click="login"
        >
          Login
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data () {
    return {
      valid: false,
      show: false,
      error: undefined,
      password: '',
      email: '',
      rules: {
        requiredName: v => !!v || 'Name is required',
        requiredEmail: v => !!v || 'E-mail is required',
        min: v => v.length >= 8 || 'Min 8 characters',
        max: v => (v && v.length <= 30) || 'Name must be less than 30 characters',
        emailMatch: () => ('The email and password you entered don\'t match'),
        emailValid: v => /.+@.+/.test(v) || 'E-mail must be valid'
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$store.dispatch('signInWithEmail', {
          email: this.email,
          password: this.password
        })
        await this.$router.push('/')
      } catch (e) { this.error = e.message }
    }
  }
}
</script>
