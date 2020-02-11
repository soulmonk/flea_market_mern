'use strict'

const S = require('fluent-schema')
const { getUserByName, createUser } = require('../repository/user')

async function meService (fastify, opts) {
  fastify.route({
    method: 'POST',
    path: '/sign-up',
    handler: onCreate,
    schema: {
      body: S.object()
        .prop('username', S.string()
          .minLength(4)
          .maxLength(128)
          .required()
        )
        .prop('password', S.string()
          .minLength(8)
          .maxLength(128)
          .required()
        ),
      response: {
        200: S.object()
          .prop('username', S.string())
      }
    }
  })

  async function onCreate (req, reply) {
    const {username, password} = req.body;
    let user = await getUserByName(this.mongo, username)
    if (user) {
        reply.code(409)
        return {
          message: `Username "${username}" already exists`
        }
    }

    await createUser(this.mongo, {username, password})
    return {status: 'ok'}
  }
}

module.exports = meService
