import { init, isCuid } from '@paralleldrive/cuid2'

const cuid = init({
  length: 14
})

export abstract class Generate {
  public readonly LENGTH = cuid.length

  static id(): string {
    return cuid()
  }

  static isCuid(id: string): boolean {
    return isCuid(id)
  }
}
