import type { Controller } from '@/core/infra/controller'
import { ValidatorCompositor } from '@/infra/validation/ValidatorCompositor'
import { AuthenticateUser } from '@/application/users/use-cases/authenticate-user/authenticate-user'
import { PrismaUsersRepository } from '@/application/users/repositories/prisma/PrismaUsersRepository'
import { AuthenticateUserController } from '@/application/users/use-cases/authenticate-user/authenticate-user.controller'

export function makeAuthenticateUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateUser = new AuthenticateUser(prismaUsersRepository)

  const validator = new ValidatorCompositor([])

  return new AuthenticateUserController(validator, authenticateUser)
}
