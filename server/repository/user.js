'use strict'

async function getCollection(mongo) {
  return mongo.db.collection('users')
}

async function getUserByName (mongo, username) {
  const col = await getCollection(mongo);
  const user = await col.find({username})
  return user;
}

module.exports = {
  getUserByName
}
