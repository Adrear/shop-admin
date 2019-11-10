import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyAeNgPOWzbmrQ8AR-CaHQ0cgzuujOkwVx0',
  authDomain: 'advitamdb.firebaseapp.com',
  databaseURL: 'https://advitamdb.firebaseio.com',
  projectId: 'advitamdb',
  storageBucket: 'advitamdb.appspot.com',
  messagingSenderId: '858326446418',
  appId: '1:858326446418:web:80c5cedded2d610a'
}

if (!firebase.apps.length) { firebase.initializeApp(config) }

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()
export default firebase
