import {
  type ConstructorProperties,
  Entity,
  type Update
} from '@/core/domain/entity'
import { ZodValidationError } from '@/core/domain/errors/ZodValidationError'
import { type Either, left, right } from '@/core/logic/either'
import type { AudioFile } from './audio-file'
import { type DocumentsProps, UploadFileSchema } from './documents.schema'

export class Documents extends Entity<DocumentsProps> {
  private audioFiles: AudioFile[]

  private constructor(
    { props, id }: ConstructorProperties<DocumentsProps>,
    audioFiles: AudioFile[]
  ) {
    super({ props, id })
    this.audioFiles = audioFiles
  }

  getAudioFiles() {
    return this.audioFiles
  }

  setAudioFiles(audioFiles: AudioFile[]) {
    this.audioFiles = audioFiles
  }

  static create(
    { props, id }: ConstructorProperties<DocumentsProps>,
    audioFiles: AudioFile[]
  ): Either<Error, Documents> {
    const result = UploadFileSchema.safeParse(props)

    if (!result.success) {
      return left(new ZodValidationError(result.error))
    }

    return right(new Documents({ props: result.data, id }, audioFiles))
  }

  static update(
    { props, id }: Update<DocumentsProps>,
    audioFiles: AudioFile[]
  ): Either<Error, Documents> {
    const result = UploadFileSchema.safeParse(props)

    if (!result.success) {
      return left(new ZodValidationError(result.error))
    }

    return right(new Documents({ props: result.data, id }, audioFiles))
  }
}
