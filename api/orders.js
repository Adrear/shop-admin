import { db } from '~/plugins/fireinit'

const getOrders = () => {
  return db.collection('Customers').get()
    .then((querySnapshot) => {
      return querySnapshot.docs
        .map((el) => {
          const obj = el.data()
          const timestamp = new Date(obj.createdAt.seconds * 1000).toISOString()
          obj.date = timestamp.substr(0, 10)
          obj.id = el.id
          obj.name = obj.sname + ' ' + obj.fname
          return obj
        })
    })
}

export {
  getOrders
}
