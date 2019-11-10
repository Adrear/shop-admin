/* eslint-disable */
import { auth } from '@/plugins/fireinit.js'

export default (context) => {
  const {store} = context

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      store.dispatch('setUser', user)
      resolve()
    })1
  })
}

