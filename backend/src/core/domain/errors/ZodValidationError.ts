import type { ZodError } from 'zod'

export class ZodValidationError extends Error {
  constructor(error?: ZodError) {
    super(
      `Field [${error?.issues?.[0].path?.[0] ?? 'Erro'}]: ${
        error?.issues?.[0].message ?? 'Dado inválido.'
      }`
    )
    this.name = 'ZodValidationError'
  }
}
