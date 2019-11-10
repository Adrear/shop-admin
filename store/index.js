import _ from 'lodash'
import Vue from 'vue'
import * as ordersAPI from '../api/orders'
import * as usersAPI from '../api/users'
import * as itemsAPI from '../api/items'
import { auth } from '@/plugins/fireinit.js'
export const strict = false

Object.defineProperty(Vue.prototype, '$_', { value: _ })

export const state = () => ({
  user: null,
  userInfo: null,
  role: null,
  currentDate: new Date().toISOString().substring(0, 10),
  items: [],
  categories: [],
  orders: []
})

export const getters = {
  getUser: state => state.user,
  getCategories: state => state.categories,
  getSubCategories: (state) => {
    let subCategories = []
    state.categories.forEach((el) => {
      subCategories = subCategories.concat(el.children)
    })
    return subCategories.map(el => el.name)
  },
  getItems: state => state.items
    .sort((x, y) => (x.available === y.available) ? 0 : x.available ? -1 : 1)
}

export const mutations = {
  SET_USER (state, payload) { state.user = payload },
  SET_ROLE (state, payload) { state.role = payload },
  SET_USER_INFO (state, payload) { state.userInfo = payload },
  DELETE_ITEM (state, item) { state.items.splice(state.items.indexOf(item), 1) },
  EDIT_ITEM (state, [index, item]) { Object.assign(state.items[index], item) },
  ADD_ITEM (state, payload) { state.items.push(payload) },
  SET_ITEMS (state, payload) { state.items = payload },
  SET_CATEGORIES (state, payload) { state.categories = payload },
  SET_ORDERS (state, payload) { state.orders = payload },
  UPDATE_CATEGORIES (state, payload) { state.categories = payload }
}

export const actions = {
  async deleteCategory ({ commit }, id) {
    try {
      await itemsAPI.deleteCategory(id)
    } catch (e) {
      alert(e)
    }
  },
  async newItems ({ commit }, items) {
    try {
      await itemsAPI.newItems(items)
    } catch (e) {
      alert(e)
    }
  },
  async updateCategories ({ commit }, categories) {
    try {
      await itemsAPI.updateCategories(categories)
      commit('UPDATE_CATEGORIES', categories)
    } catch (e) {
      alert(e)
    }
  },
  async getCategories ({ commit, state }) {
    const data = await itemsAPI.getCategories()
    commit('SET_CATEGORIES', data)
  },
  async getOrders ({ commit, state }) {
    const data = await ordersAPI.getOrders()
    commit('SET_ORDERS', data)
  },
  async getItems ({ commit, state }) {
    const data = await itemsAPI.getItems()
    commit('SET_ITEMS', data)
  },

  async signInWithEmail ({ commit }, { email, password }) {
    const role = await usersAPI.getUserRoleByEmail(email)
    if (role === 'new') {
      await auth.createUserWithEmailAndPassword(email, password)
      await usersAPI.updateUserRoleByEmail(email)
    } else {
      await auth.signInWithEmailAndPassword(email, password)
    }
  },
  async signOut ({ commit }) {
    await auth.signOut()
    await commit('SET_USER', null)
    await commit('SET_ROLE', null)
    await commit('SET_USER_INFO', null)
  },
  async setUser ({ commit, dispatch }, user) {
    try {
      commit('SET_USER', user)
      if (user) {
        const userInfo = await usersAPI.getUserByID(user)
        commit('SET_USER_INFO', userInfo)
        if (userInfo.role === 'admin') {
          commit('SET_ROLE', 'admin')
        }
        if (userInfo.role === 'employee') {
          commit('SET_ROLE', 'employee')
        }
        if (userInfo.role !== 'manager' && userInfo.role !== 'admin') {
          commit('SET_ROLE', 'guest')
        }
      }
    } catch (e) { console.log(e) }
  }
}
