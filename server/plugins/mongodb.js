'use strict'

const fp = require('fastify-plugin')
const mongodb = require('fastify-mongodb')

async function mongodbPlugin (fastify/*, opts */) {
  fastify.register(mongodb, {
    forceClose: true,
    url: 'mongodb://localhost/flea_market_mern'
  })
}

module.exports = fp(mongodbPlugin)
