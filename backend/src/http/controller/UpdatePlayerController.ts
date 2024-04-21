import { FastifyRequest, FastifyReply } from 'fastify'

import z from 'zod'
import { UpdatePlayerService } from '../../services/UpdatePlayerService'

export async function UpdatePlayer(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateParamsSchema = z.object({
    id: z.string()
  })

  const updateBodySchema = z.object({
    name: z.string().optional(),
    score: z.number().optional()
  })

  const { id } = updateParamsSchema.parse(request.params)
  const { name, score } = updateBodySchema.parse(request.body)
  const updatePlayer = new UpdatePlayerService()

  try {
    const player = await updatePlayer.execute({
      id,
      name,
      score
    })

    return reply.send(player)
  } catch (error) {
    return reply.status(500).send({
      error: 'Internal server error'
    })
  }
}
