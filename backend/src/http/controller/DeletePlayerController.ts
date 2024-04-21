import { FastifyRequest, FastifyReply } from 'fastify'

import z from 'zod'
import { PlayerNotFound } from '../../services/erros/player-not-found'
import { DeletePlayerService } from '../../services/DeletePlayerService'

export async function DeletePlayer(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteBodySchema = z.object({
    id: z.string()
  })

  const { id } = deleteBodySchema.parse(request.body)
  const deletePlayer = new DeletePlayerService()

  try {
    const player = await deletePlayer.execute({
      id
    })

    return reply.send(player)
  } catch (error) {
    if (error instanceof PlayerNotFound) {
      return reply.code(404).send({ error: error.message })
    }
    return reply.status(500).send({
      error: 'Internal server error'
    })
  }
}
