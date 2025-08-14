import type { Controller } from '@/core/infra/controller'
import { type HttpResponse, clientError, ok } from '@/core/infra/http-response'
import type { Validator } from '@/core/infra/validator'
import type { AuthenticateUser } from './authenticate-user'

type AuthenticateUserControllerRequest = {
  email: string
  password: string
}

export class AuthenticateUserController implements Controller {
  constructor(
    private readonly validator: Validator<AuthenticateUserControllerRequest>,
    private authenticateUser: AuthenticateUser
  ) {}

  async handle(
    request: AuthenticateUserControllerRequest
  ): Promise<HttpResponse> {
    const validated = this.validator.validate(request)

    if (validated.isLeft()) {
      return clientError(validated.value)
    }

    const result = await this.authenticateUser.execute(request)

    if (result.isLeft()) {
      const error = result.value
      return clientError(error)
    }

    const { token, userId } = result.value
    return ok({ message: 'Logado com sucesso!', token, userId })
  }
}
