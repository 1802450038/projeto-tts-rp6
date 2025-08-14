export class UserNotFoundError extends Error {
  constructor() {
    super('Usuário não foi encontrado.')
    this.name = 'UserNotFoundError'
  }
}
