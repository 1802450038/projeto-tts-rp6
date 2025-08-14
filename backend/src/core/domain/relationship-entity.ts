export class RelationshipEntity<T> {
  public readonly props: T

  constructor(props: T) {
    this.props = props
  }

  public equals(object?: RelationshipEntity<T> | null): boolean {
    if (object == null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    return true
  }
}
