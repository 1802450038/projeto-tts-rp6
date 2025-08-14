export class InvalidEmailOrPasswordError extends Error {
  constructor() {
    super('Senha ou email inválido.')
    this.name = 'InvalidEmailOrPasswordError'
  }
}
