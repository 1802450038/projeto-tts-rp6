import prismaClient from '@/infra/prisma/client'
import { UserFactory } from '@/tests/factories/UserFactory'
import { app } from '@infra/http/app'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import type { IUsersRepository } from '../../repositories/IUsersRepository'
import { PrismaUsersRepository } from '../../repositories/prisma/PrismaUsersRepository'

let usersRepository: IUsersRepository

describe('Authenticate User (end-to-end)', () => {
  const user = UserFactory.create()

  beforeAll(async () => {
    usersRepository = new PrismaUsersRepository()
    await usersRepository.create(user)
  })

  afterAll(async () => {
    await prismaClient.user.delete({
      where: {
        id: user.id
      }
    })
  })

  test('should be able to authenticate', async () => {
    const response = await request(app).post('/api/v1/auth/sign-in').send({
      email: user.props.email,
      password: user.props.password
    })

    expect(response.status).toBe(StatusCodes.OK)

    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String)
      })
    )
  })
})
