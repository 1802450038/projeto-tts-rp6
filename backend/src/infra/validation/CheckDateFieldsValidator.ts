import type { Validator } from '@/core/infra/validator'
import { type Either, left, right } from '@/core/logic/either'
import { InvalidDateError } from './errors/InvalidDateError'

export class CheckDateFieldsValidator<T = any> implements Validator<T> {
  constructor(private readonly fieldsToCheck: string[]) {}

  public validate(data: T): Either<InvalidDateError, null> {
    for (const field of this.fieldsToCheck) {
      if (Number.isNaN(new Date(data[field]).getTime())) {
        return left(new InvalidDateError())
      }
    }

    return right(null)
  }
}
