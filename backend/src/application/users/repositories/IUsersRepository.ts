import type { User } from '../domain/user'

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>
  exists(email: string): Promise<boolean>
  findById(id: string): Promise<User | null>
  create(user: User): Promise<void>
  update(user: User): Promise<void>
}
