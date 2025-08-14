import { adaptMiddleware } from '@/core/infra/adapters/express-middleware-adapter'
import { adaptRoute } from '@/core/infra/adapters/express-route-adapter'
import { Router } from 'express'
import { makeEnsureAuthenticated } from '../factories/controllers/middlewares/makeEnsureAuthenticated'

import { makeRefreshTokenController } from '../factories/controllers/user/makeRefreshTokenController'

export const user = Router()

user.get(
  '/refresh-token',
  adaptMiddleware(makeEnsureAuthenticated()),
  adaptRoute(makeRefreshTokenController())
)
