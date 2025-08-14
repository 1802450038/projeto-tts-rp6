import prismaClient from '@/infra/prisma/client'
import type { User } from '../../domain/user'
import { UserMapper } from '../../mappers/user-mapper'
import type { IUsersRepository } from '../IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async exists(email: string): Promise<boolean> {
    const userExists = await prismaClient.user.findUnique({
      where: {
        email
      }
    })

    return !!userExists
  }

  async findById(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = await UserMapper.toPersistence(user)

    await prismaClient.user.create({
      data
    })
  }

  async update(user: User): Promise<void> {
    const data = await UserMapper.toPersistence(user)

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        ...data
      }
    })
  }
}
