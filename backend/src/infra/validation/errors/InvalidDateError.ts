export class InvalidDateError extends Error {
  constructor() {
    super('Data inválida.')
    this.name = 'InvalidDateError'
  }
}
