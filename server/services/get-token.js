'use strict'

const S = require('fluent-schema')
const { getUserByName, checkPassword } = require('../repository/user')

async function getTokenService (fastify/*, opts */) {
  const tokenSchema = {
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
        .prop('token', S.string())
    }
  }

  // route configuration
  fastify.route({
    method: 'POST',
    path: '/token',
    handler: onGetToken,
    schema: tokenSchema
  })

  async function onGetToken (req, reply) {
    req.log.info('onGetToken')
    const { username, password } = req.body

    const error = () => reply.code(400).send({
      type: 'error',
      message: 'wrong username or password'
    })

    const user = await getUserByName(this.mongo, username)
    if (!user) {
      return error()
    }

    const validPwd = await checkPassword(password, user.password)
    if (!validPwd) {
      return error()
    }

    const token = await reply.jwtSign({ username }, {
      expiresIn: 3600 // 1 hour
    })

    return { token }
  }
}

module.exports = getTokenService
