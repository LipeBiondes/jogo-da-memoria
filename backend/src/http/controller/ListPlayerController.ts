import { FastifyRequest, FastifyReply } from 'fastify'

import { PlayerDataNotFound } from '../../services/erros/player-data-not-found'
import { ListPlayersService } from '../../services/ListPlayersService'

export async function ListPlayers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const listPlayers = new ListPlayersService()
    const players = await listPlayers.execute()

    return reply.send(players)
  } catch (error) {
    if (error instanceof PlayerDataNotFound) {
      return reply.code(404).send({ error: error.message })
    }
    return reply.status(500).send()
  }
}
