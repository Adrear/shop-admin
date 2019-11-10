import { db, storage } from '~/plugins/fireinit'

function newItems (items) {
  items.forEach((item) => {
    return db.collection('Items').doc(item.id).set(item)
  })
}

function deleteItem (id) {
  return db.collection('Items').doc(id).delete()
}

const uploadImage = (id, uploadImage) => {
  if (uploadImage.type === 'jpeg') {
    return storage.ref('Items/' + id + '/' + uploadImage.name + '.' + uploadImage.type)
      .putString(uploadImage.data.slice(23), 'base64')
      .then((res) => {
        return res.ref.getDownloadURL()
      })
  }
  if (uploadImage.type === 'png') {
    return storage.ref('Items/' + id + '/' + uploadImage.name + '.' + uploadImage.type)
      .putString(uploadImage.data.slice(22), 'base64')
      .then((res) => {
        return res.ref.getDownloadURL()
      })
  } else { return '' }
}

function updateItem (item) {
  return db.collection('Items').doc(item.id).set({
    available: item.available,
    name: item.name,
    description: item.description,
    price: item.price,
    stock_quantity: item.stock_quantity,
    images: item.images,
    categorySubName: item.categorySubName,
    categorySubId: item.categorySubId,
    categoryName: item.categoryName,
    categoryId: item.categoryId,
    vendor: item.vendor,
    params: item.params
  }, { merge: true })
}

function createNewItem (item) {
  return db.collection('Items').add(
    {
      createdAt: new Date(),
      available: item.available,
      name: item.name,
      description: item.description,
      price: item.price,
      stock_quantity: item.stock_quantity
    }).then((ref) => {
    return ref.id
  })
}

function getItems () {
  return db.collection('Items').get()
    .then((querySnapshot) => {
      return querySnapshot.docs
        .map((el) => {
          const obj = el.data()
          obj.id = el.id
          return obj
        })
    })
}

function getCategories () {
  return db.collection('Categories').get()
    .then((querySnapshot) => {
      return querySnapshot.docs
        .map((el) => {
          const obj = el.data()
          obj.uid = el.id
          return obj
        })
    })
}

function updateCategories (categories) {
  return categories.forEach((el) => {
    if (el.uid) {
      return db.collection('Categories').doc(el.uid).set(el)
    } else {
      return db.collection('Categories').add(el).then((docRef) => {
        el.uid = docRef.id
      })
    }
  })
}

function deleteCategory (id) {
  return db.collection('Categories').doc(id).delete()
}

export {
  deleteItem,
  updateItem,
  createNewItem,
  uploadImage,
  getItems,
  getCategories,
  updateCategories,
  deleteCategory,
  newItems
}
