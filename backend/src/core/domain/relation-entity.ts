export type ToResponseBody<T> = T & { _id: string }

export type TimeStamps = {
  createdAt?: Date | null
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export type RelationConstructorProperties<T> = {
  props: T
  timeStamps?: TimeStamps
}

export type RelationUpdate<T> = {
  props: T
  timeStamps?: TimeStamps
}

export class RelationEntity<T> {
  public readonly props: T
  public readonly timeStamps?: TimeStamps

  constructor({ props, timeStamps }: RelationConstructorProperties<T>) {
    this.props = props
    this.timeStamps = timeStamps
  }

  public equals(object?: RelationEntity<T> | null): boolean {
    if (!object || object == null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    return false
  }

  public toResponseBody() {
    return {
      ...this.props,
    }
  }
}
