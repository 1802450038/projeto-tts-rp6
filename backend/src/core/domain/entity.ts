import { Generate } from '../logic/generate'

export type ToResponseBody<T> = Partial<T> & {
  _id: string
  timeStamps?: TimeStamps
}

export type AllToResponseBody<T> = T & {
  _id: string
  timeStamps?: TimeStamps
}

export type PartialToDomain<T> = Partial<T> & { id?: string }

export type TimeStamps = {
  createdAt?: Date | null
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export type ConstructorProperties<T extends object> = {
  id?: string
  props: T
  timeStamps?: TimeStamps
}

export type Update<T extends object> = {
  props: T
  id: string
  timeStamps?: TimeStamps
}

export type PartialIncludes<T extends object> = {
  [P in keyof T]?: boolean
}

export type PartialFields<T> = {
  [P in keyof T]?: boolean | PartialFields<T[P]>
}

export class Entity<T extends object> {
  protected readonly _id: string
  public readonly props: T
  public readonly timeStamps?: TimeStamps

  constructor({ props, id, timeStamps }: ConstructorProperties<T>) {
    this._id = id || Generate.id()
    this.props = props
    this.timeStamps = timeStamps
  }

  get id() {
    return this._id
  }

  public equals(object?: Entity<T> | null): boolean {
    if (!object || object == null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    return this.id === object.id
  }

  public createVersion(versionNumber: number) {
    return {
      id: Generate.id(),
      versionNumber,
      entityId: this._id,
      ...this.props
    }
  }

  public toResponseBody(
    fields?: PartialFields<T>
  ): ToResponseBody<T> | AllToResponseBody<T> {
    if (!fields) {
      return {
        _id: this.id,
        ...this.props,
        timeStamps: this.timeStamps
      }
    }

    const partialObj = {
      _id: this.id,
      timeStamps: this.timeStamps
    } as T

    for (const key in fields) {
      if (fields[key]) {
        partialObj[key] = this.props[key]
      }
    }

    return partialObj as ToResponseBody<T>
  }
}
