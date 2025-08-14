export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Este usuário já existe.')
    this.name = 'UserAlreadyExistsError'
  }
}
