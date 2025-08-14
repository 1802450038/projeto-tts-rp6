import {
  type ConstructorProperties,
  Entity,
  type Update
} from '@/core/domain/entity'
import { ZodValidationError } from '@/core/domain/errors/ZodValidationError'
import { type Either, left, right } from '@/core/logic/either'
import { type UserProps, UserSchema } from './user.schema'

export class User extends Entity<UserProps> {
  private constructor({ props, id }: ConstructorProperties<UserProps>) {
    super({ props, id })
  }

  static create({
    props,
    id
  }: ConstructorProperties<UserProps>): Either<Error, User> {
    const result = UserSchema.safeParse(props)

    if (!result.success) {
      return left(new ZodValidationError(result.error))
    }

    return right(new User({ props: result.data, id }))
  }

  static update({ props, id }: Update<UserProps>): Either<Error, User> {
    const result = UserSchema.safeParse(props)

    if (!result.success) {
      return left(new ZodValidationError(result.error))
    }

    return right(new User({ props: result.data, id }))
  }
}
