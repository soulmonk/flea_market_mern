'use strict'

const path = require('path')

async function webService (fastify, opts) {
  fastify.setNotFoundHandler(onMain)

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../../frontend/build'),
    prefix: '/' // optional: default '/'
  })

  fastify.route({
    method: 'GET',
    url: '/',
    handler: onMain
  })

  function onMain (req, reply) {
    reply.sendFile('index.html')

  }
}

module.exports = webService
