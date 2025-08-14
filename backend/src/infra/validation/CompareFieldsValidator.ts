import type { Validator } from '@/core/infra/validator'
import { type Either, left, right } from '@/core/logic/either'

type CompareFieldsValidatorProps<T> = {
  field: keyof T
  fieldToCompare: keyof T
  keyMessage?: string
}

export class CompareFieldsValidator<T = any> implements Validator<T> {
  constructor(private readonly fields: CompareFieldsValidatorProps<T>) {}

  public validate(data: T): Either<Error, null> {
    if (data[this.fields.field] !== data[this.fields.fieldToCompare]) {
      return left(new Error(this.fields.keyMessage ?? 'Campos não coincidem.'))
    }
    return right(null)
  }
}
