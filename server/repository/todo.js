'use strict'

async function getCollection (mongo) {
  return mongo.db.collection('todo')
}

async function list (mongo) {
  const col = await getCollection(mongo)
  return col.find({removedAt: null}).toArray()
}

async function findById(mongo, id) {
  const col = await getCollection(mongo)
  const res = col
    .find({
      _id: id,
      removedAt: null
    }).toArray()
  return res[0]
}

async function create (mongo, {title, date}) {
  const col = await getCollection(mongo)
  const data = {
    title,
    done: false,
    removedAt: null,
    date: new Date(date),
  }
  const model = await col.insertOne(data)
  return {id: model.insertedId,...data}
}

async function remove (mongo, id) {
  const model = await findById(mongo, id)
  if (!model) {
    throw new Error('not found')
  }
  const col = await getCollection(mongo)
  return col.update({_id: id}, {$set: {removedAt: Date.now()}})
}

async function done (mongo, id) {
  const model = await findById(mongo, id)
  if (!model) {
    throw new Error('not found')
  }
  const col = await getCollection(mongo)
  return col.update({_id: id}, {$set: {done: true}})
}

module.exports = {
  list,
  create,
  remove,
  done
}
