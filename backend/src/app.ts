import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
import cors from '@fastify/cors'

export const app = fastify()

app.register(appRoutes)
app.register(cors)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format()
    })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here we shold log to an external service Database or File
  }
  return reply.status(500).send({
    message: 'Internal server error.'
  })
})
