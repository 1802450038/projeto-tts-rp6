import { env } from '@/config'
import { type Either, left, right } from '@/core/logic/either'
import { sign, verify } from 'jsonwebtoken'
import type { User } from '../../application/users/domain/user'
import { InvalidJWTTokenError } from './errors/InvalidJWTTokenError'

interface JWTData {
  userId: string
  token: string
}

export interface JWTTokenPayload {
  exp: number
  sub: string
}

export class JWT {
  public readonly userId: string
  public readonly token: string

  private constructor({ userId, token }: JWTData) {
    this.userId = userId
    this.token = token
  }

  static decodeToken(
    token: string
  ): Either<InvalidJWTTokenError, JWTTokenPayload> {
    try {
      const decoded = verify(token, env.JWT_SECRET_KEY) as JWTTokenPayload
      return right(decoded)
    } catch (_err) {
      return left(new InvalidJWTTokenError())
    }
  }

  static createFromJWT(token: string): Either<InvalidJWTTokenError, JWT> {
    const jwtPayloadOrError = JWT.decodeToken(token)

    if (jwtPayloadOrError.isLeft()) {
      return left(jwtPayloadOrError.value)
    }

    const jwt = new JWT({ token, userId: jwtPayloadOrError.value.sub })
    return right(jwt)
  }

  static refreshToken(userId: string): JWT {
    const token = sign({}, env.JWT_SECRET_KEY, {
      subject: userId,
      expiresIn: env.JWT_EXPIRES_IN
    })

    const jwt = new JWT({ token, userId })
    return jwt
  }

  static signUser(user: User): JWT {
    const token = sign({}, env.JWT_SECRET_KEY, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN
    })

    const jwt = new JWT({ userId: user.id, token })
    return jwt
  }
}
