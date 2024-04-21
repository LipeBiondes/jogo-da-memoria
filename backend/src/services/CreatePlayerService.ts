import prismaCliente from '../prisma'

interface createPlayerProps {
  name: string
  score: number
}

export class CreatePlayerService {
  async execute({ name, score }: createPlayerProps) {
    const player = await prismaCliente.player.create({
      data: {
        name,
        score
      }
    })

    return player
  }
}
