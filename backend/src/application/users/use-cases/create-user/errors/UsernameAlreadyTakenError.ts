export class UsernameAlreadyTakenError extends Error {
  constructor() {
    super('Já existe um usuário com esse nome.')
    this.name = 'UsernameAlreadyTakenError'
  }
}
