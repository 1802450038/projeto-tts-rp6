import {
  type ConstructorProperties,
  Entity,
  type Update
} from '@/core/domain/entity'
import { ZodValidationError } from '@/core/domain/errors/ZodValidationError'
import { type Either, left, right } from '@/core/logic/either'
import { type AudioFileProps, AudioFileSchema } from './audio-file.schema'

export class AudioFile extends Entity<AudioFileProps> {
  private constructor({ props, id }: ConstructorProperties<AudioFileProps>) {
    super({ props, id })
  }

  static create({
    props,
    id
  }: ConstructorProperties<AudioFileProps>): Either<Error, AudioFile> {
    const result = AudioFileSchema.safeParse(props)

    if (!result.success) {
      return left(new ZodValidationError(result.error))
    }

    return right(new AudioFile({ props: result.data, id }))
  }

  static update({
    props,
    id
  }: Update<AudioFileProps>): Either<Error, AudioFile> {
    const result = AudioFileSchema.safeParse(props)

    if (!result.success) {
      return left(new ZodValidationError(result.error))
    }

    return right(new AudioFile({ props: result.data, id }))
  }

  toResponseBody() {
    return {
      _id: this.id,
      ...this.props,
      timeStamps: this.timeStamps,
      speechMarks: JSON.parse(this.props.speechMarks)
    }
  }
}
