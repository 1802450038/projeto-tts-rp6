export class InvalidPasswordLengthError extends Error {
  constructor() {
    super('Tamanho de senha inválido.')
    this.name = 'InvalidPasswordLengthError'
  }
}
