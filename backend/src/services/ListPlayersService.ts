import prismaCliente from '../prisma'
import { PlayerDataNotFound } from './erros/player-data-not-found'

export class ListPlayersService {
  async execute() {
    const players = await prismaCliente.player.findMany()
    if (!players) {
      throw new PlayerDataNotFound()
    }
    return players
  }
}
