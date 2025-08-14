import { type Either, left, right } from '@/core/logic/either'
import { User } from '../../domain/user'
import type { IUsersRepository } from '../../repositories/IUsersRepository'
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError'

type CreateUserRequest = {
  email: string
  name: string
  username?: string
  password: string
  phone?: string
}

type CreateUserResponse = Either<UserAlreadyExistsError, User>

export class CreateUser {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    email,
    username,
    ...request
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const userAlreadyExists = await this.usersRepository.exists(email)

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError())
    }

    const userOrError = User.create({
      props: {
        ...request,
        email
      }
    })

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value
    await this.usersRepository.create(user)

    return right(user)
  }
}
