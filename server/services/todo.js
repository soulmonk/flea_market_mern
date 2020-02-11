'use strict'

const S = require('fluent-schema')

async function todoService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/',
    handler: onList,
    onRequest: fastify.authenticate,
    schema: {
      response: {
        200: S.object().prop('status', S.string())
      }
    }
  })

  async function onList (req, reply) {
    return { status: 'ok' }
  }
}

module.exports = todoService
