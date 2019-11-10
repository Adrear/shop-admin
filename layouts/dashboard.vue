<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      hide-overlay
      stateless
      app
    >
      <v-list>
        <v-flex class="logoMain" :class="{minivariant: miniVariant}">
          <v-img
            class="img"
            src="/logo.jpg"
          />
        </v-flex>
        <v-divider />
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      app
    >
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-avatar size="36px" style="cursor: pointer" v-on="on">
            <img
              v-if="user && user.icon"
              :src="user.icon"
              :alt="user.name"
            >
            <v-icon v-else color="red">
              people
            </v-icon>
            <v-icon>
              arrow_drop_down
            </v-icon>
          </v-avatar>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in links"
            :key="index"
            :to="item.to"
            router
            exact
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container>
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
      clipped: false,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Главная',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Заказы',
          to: '/orders'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Товары',
          to: '/items'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'CRM',
          to: '/crm'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Категории',
          to: '/categories'
        }
      ],
      links: [
        {
          icon: 'bubble_chart',
          title: 'Настройки',
          to: '/settings'
        },
        {
          icon: 'bubble_chart',
          title: 'Выйти',
          to: '/logout'
        }
      ],
      miniVariant: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    user () {
      return this.$store.state.userInfo || {}
    }
  }
}
</script>
