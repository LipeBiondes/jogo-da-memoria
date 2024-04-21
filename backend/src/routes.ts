import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify'
import { ListPlayers } from './controller/ListPlayerController'
import { CreatePlayer } from './controller/CreatePlayerController'
import { UpdatePlayer } from './controller/UpdatePlayerController'
import { DeletePlayer } from './controller/DeletePlayerController'

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get(
    '/player',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return ListPlayers(request, reply)
    }
  )

  fastify.post(
    '/player',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return CreatePlayer(request, reply)
    }
  )

  fastify.put(
    '/player/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return UpdatePlayer(request, reply)
    }
  )

  fastify.delete(
    '/player',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return DeletePlayer(request, reply)
    }
  )
}
