import { type HttpResponse, ok } from '@/core/infra/http-response'
import type { RefreshToken } from './refresh-token'

type RefreshTokenControllerRequest = {
  currentUserId: string
}

export class RefreshTokenController {
  constructor(private readonly refreshToken: RefreshToken) {}

  async handle(request: RefreshTokenControllerRequest): Promise<HttpResponse> {
    const refreshToken = await this.refreshToken.execute(request)
    return ok({ refreshToken: refreshToken.value })
  }
}
