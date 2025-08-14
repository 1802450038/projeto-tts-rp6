import { Password } from '@/core/domain/password'
import type { User as PersistenceUser } from '@prisma/client'
import { User } from '../domain/user'

export const UserMapper = {
  toDomain: (raw: PersistenceUser) => {
    const userOrError = User.create({
      props: {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        phone: raw.phone
      },
      id: raw.id
    })

    if (userOrError.isLeft()) {
      throw new Error('Usuário inválido.')
    }

    return userOrError.value
  },
  toPersistence: async (user: User) => {
    const hashed = Password.create(user.props.password, true)

    if (hashed.isLeft()) {
      throw new Error('Erro na criação do usuário.')
    }

    const password = await hashed.value.getHashedValue()

    return {
      id: user.id,
      name: user.props.name,
      email: user.props.email,
      phone: user.props.phone,
      password
    }
  }
}
