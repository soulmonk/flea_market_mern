'use strict'

const S = require('fluent-schema')
const { list, create, remove, done } = require('../repository/todo')

async function todoService (fastify, opts) {
  fastify.addHook('onRequest', fastify.authenticate)
  fastify.setNotFoundHandler(function (request, reply) {
    reply
      .code(404)
      .type('application/json')
      .send({ message: 'Requested transaction does not exist' })
  })

  const todoSchema = S.object()
    .prop('id', S.string())
    .prop('title', S.string())
    .prop('done', S.boolean())
    .prop('date', S.string().format('date-time'))

  fastify.route({
    method: 'GET',
    path: '/',
    handler: onList,
    schema: {
      response: {
        200: S.array().items(todoSchema)
      }
    }
  })

  fastify.route({
    method: 'POST',
    path: '/',
    handler: onCreate,
    schema: {
      body: S.object()
        .prop('title', S.string()
          .minLength(4)
          .maxLength(128)
          .required()
        )
        .prop('date', S.string().format('date-time')),
      response: {
        200: todoSchema
      }
    }
  })

  fastify.route({
    method: 'DELETE',
    path: '/:id',
    handler: onDelete,
    schema: {
      response: {
        200: S.object().prop('status', S.boolean())
      }
    }
  })

  async function onList (req, reply) {
    return list(this.mongo)
  }

  async function onCreate (req, reply) {
    return await create(this.mongo, req.body)
}

  async function onDelete (req, reply) {
    await remove(this.mongo, req.params.id)
    return {status: true}
  }
}

todoService.autoPrefix = '/api/todo'

module.exports = todoService
