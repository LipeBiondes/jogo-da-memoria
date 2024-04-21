import prismaCliente from '../prisma'
import { PlayerNotFound } from './erros/player-not-found'

interface deletePlayerProps {
  id: string
}

export class DeletePlayerService {
  async execute({ id }: deletePlayerProps) {
    const playerExists = await prismaCliente.player.findFirst({
      where: {
        id
      }
    })

    if (!playerExists) {
      throw new PlayerNotFound()
    }

    const player = await prismaCliente.player.delete({
      where: {
        id
      }
    })

    return player
  }
}
