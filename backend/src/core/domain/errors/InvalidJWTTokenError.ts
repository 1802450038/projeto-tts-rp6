export class InvalidJWTTokenError extends Error {
  constructor() {
    super('Token inválido.')
    this.name = 'InvalidJWTTokenError'
  }
}
