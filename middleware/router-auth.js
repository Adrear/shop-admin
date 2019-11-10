export default function ({ store, redirect, route }) {
  if (store.state.user != null && route.name === 'login') { redirect('/') }
  if (store.state.user == null && route.name !== 'login') { redirect('/login') }
}
