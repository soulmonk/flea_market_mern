'use strict'

async function getCollection (mongo) {
  return mongo.db.collection('todo')
}

async function list (mongo) {
  const col = await getCollection(mongo)
  return col.find({removedAt: null}).toArray()
    .then(res => res.map(item => {
      item.id = item._id
      return item
    }))
}

async function findById(mongo, id) {
  const col = await getCollection(mongo)
  const res = await col
    .find({
      _id: new mongo.ObjectId(id),
      removedAt: null
    }).toArray()
  return res[0]
}

async function create (mongo, {description, eta}) {
  const col = await getCollection(mongo)
  const data = {
    description,
    done: false,
    removedAt: null,
    eta: new Date(eta),
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
  return col.updateOne({_id: new mongo.ObjectId(id)}, {$set: {removedAt: Date.now()}})
}

async function done (mongo, id, done) {
  const model = await findById(mongo, id)
  if (!model) {
    throw new Error('not found')
  }
  const col = await getCollection(mongo)
  return col.updateOne({_id: new mongo.ObjectId(id)}, {$set: {done}})
}

module.exports = {
  list,
  create,
  remove,
  done
}
