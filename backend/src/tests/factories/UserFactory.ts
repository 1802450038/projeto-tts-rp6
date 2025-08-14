import { User } from '@/application/users/domain/user'
import type { UserProps } from '@/application/users/domain/user.schema'
import { JWT } from '@/core/domain/jwt'
import { faker } from '@faker-js/faker'

type UserOverrides = Partial<UserProps> & {
  id?: string
}

const generateRandomUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.number()
})

export class UserFactory {
  static create(overrides?: UserOverrides) {
    const entity = User.create({
      props: {
        ...generateRandomUser(),
        ...overrides
      },
      id: overrides?.id
    })

    return entity.value as User
  }

  static update(overrides: UserOverrides) {
    const opportunity = User.create({
      props: {
        ...generateRandomUser(),
        ...overrides
      },
      id: overrides.id
    })

    return opportunity.value as User
  }

  static createMany(overrides: UserOverrides[]) {
    return overrides.map((override) => UserFactory.create(override))
  }

  static createAndAuthenticate(overrides?: UserOverrides) {
    const user = UserFactory.create(overrides)
    const jwt = JWT.signUser(user)

    return {
      user,
      jwt
    }
  }
}
