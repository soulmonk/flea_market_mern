'use strict'

const crypto = require('crypto')
const secret_key = "no_need_extract_to_config-thi-is-q1w2e3r4"

async function getCollection(mongo) {
  return mongo.db.collection('user')
}

async function getUserByName (mongo, username) {
  const col = await getCollection(mongo);
  return col.find({username}).toArray()
    .then(res => res[0]);
}

async function createUser (mongo, {username, password}) {
  const col = await getCollection(mongo);
  return col.insertOne({username, password: crypt(password)})
}

function crypt(password) {
  return crypto.createHmac('sha256', secret_key)
    .update(password)
    .digest('hex');
}

async function checkPassword(plain, stored) {
  if (!plain || !stored) {
    return false
  }

  return crypt(plain) === stored
}

module.exports = {
  getUserByName,
  createUser,
  checkPassword
}
