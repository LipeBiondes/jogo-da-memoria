import { FastifyInstance } from 'fastify'

import { ListPlayers } from './controller/ListPlayerController'
import { CreatePlayer } from './controller/CreatePlayerController'
import { UpdatePlayer } from './controller/UpdatePlayerController'
import { DeletePlayer } from './controller/DeletePlayerController'

export async function appRoutes(app: FastifyInstance) {
  app.get('/player', ListPlayers)
  app.post('/player', CreatePlayer)
  app.put('/player/:id', UpdatePlayer)
  app.delete('/player', DeletePlayer)
}
