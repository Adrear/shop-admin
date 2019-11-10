import { db } from '~/plugins/fireinit'

function getUserRoleByEmail (email) {
  return db.collection('Users').where('email', '==', email).get().then((querySnapshot) => {
    return querySnapshot.docs[0].data().role
  })
}

function updateUserRoleByEmail (email) {
  return db.collection('Users').where('email', '==', email).get().then((querySnapshot) => {
    return db.collection('Users').doc(querySnapshot.docs[0].id).update({
      role: 'manager'
    })
  })
}

function getUserByID (user) {
  return db.collection('Users')
    .where('uid', '==', user.uid)
    .get()
    .then((querySnapshot) => {
      const obj = querySnapshot.docs[0].data()
      obj.id = querySnapshot.docs[0].id
      return obj
    })
}

export {
  getUserRoleByEmail,
  updateUserRoleByEmail,
  getUserByID
}
