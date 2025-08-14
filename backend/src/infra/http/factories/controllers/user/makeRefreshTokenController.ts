
import { RefreshToken } from '@/application/users/use-cases/refresh-token/refresh-token'
import { RefreshTokenController } from '@/application/users/use-cases/refresh-token/refresh-token.controller'
import type { Controller } from '@/core/infra/controller'

export function makeRefreshTokenController(): Controller {
  const refreshToken = new RefreshToken()
  return new RefreshTokenController(refreshToken)
}
