import { FastifyRequest, FastifyReply } from 'fastify'

import z from 'zod'
import { PlayerAlreadyExistsError } from '../../services/erros/player-already-exists-error'
import { PlayerDataNotFound } from '../../services/erros/player-data-not-found'
import { CreatePlayerService } from '../../services/CreatePlayerService'

export async function CreatePlayer(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    score: z.number()
  })
  const { name, score } = registerBodySchema.parse(request.body)

  const createPlayer = new CreatePlayerService()
  try {
    const player = await createPlayer.execute({
      name,
      score
    })

    return reply.send(player)
  } catch (error) {
    if (error instanceof PlayerAlreadyExistsError) {
      return reply.code(400).send({ error: error.message })
    }
    if (error instanceof PlayerDataNotFound) {
      return reply.code(404).send({ error: error.message })
    }
    return reply.status(500).send({
      error: 'Erro interno do servidor'
    })
  }
}
