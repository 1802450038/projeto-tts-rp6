import { PrismaUsersRepository } from '@/application/users/repositories/prisma/PrismaUsersRepository'
import type { Middleware } from '@/core/infra/middleware'
import { EnsureAuthenticatedMiddleware } from '@/infra/http/middlewares/ensure-authenticated'

export function makeEnsureAuthenticated(): Middleware {
  const usersRepository = new PrismaUsersRepository()
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware(
    usersRepository
  )

  return ensureAuthenticatedMiddleware
}
