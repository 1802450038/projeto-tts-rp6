import { app } from '@/infra/http/app'
import prismaClient from '@/infra/prisma/client'
import { UserFactory } from '@/tests/factories/UserFactory'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import type { IUsersRepository } from '../../repositories/IUsersRepository'
import { PrismaUsersRepository } from '../../repositories/prisma/PrismaUsersRepository'

let usersRepository: IUsersRepository

describe('Create user (end-to-end)', () => {
  const existingUser = UserFactory.create()

  beforeAll(async () => {
    usersRepository = new PrismaUsersRepository()
    await usersRepository.create(existingUser)
  })

  afterAll(async () => {
    await prismaClient.user.deleteMany({
      where: {
        id: existingUser.id
      }
    })
  })

  test('should create an user', async () => {
    const {
      props: { name, email, password }
    } = UserFactory.create()

    const data = {
      name,
      email,
      password,
      confirmPassword: password
    }

    const response = await request(app).post('/api/v1/auth/sign-up').send(data)
    expect(response.status).toBe(StatusCodes.CREATED)
  })

  test('should not be able to create an user with invalid data', async () => {
    const {
      props: { name, password }
    } = UserFactory.create()

    const data = {
      name,
      confirmPassword: password
    }

    const response = await request(app).post('/api/v1/auth/sign-up').send(data)
    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
  })

  test('should not be able to create an user with existing email', async () => {
    const {
      props: { name, password }
    } = UserFactory.create()

    const data = {
      name,
      email: existingUser.props.email,
      password,
      confirmPassword: password
    }

    await request(app).post('/api/v1/auth/sign-up').send(data)

    const response2 = await request(app).post('/api/v1/auth/sign-up').send(data)
    expect(response2.status).toBe(StatusCodes.CONFLICT)
  })
})
