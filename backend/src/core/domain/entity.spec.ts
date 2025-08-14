import { describe, expect, test } from 'vitest'
import { Entity } from '@core/domain/entity'

type Props = {
  foo?: string
}

class CustomEntity extends Entity<Props> {}

describe('Entity', () => {
  test('should generate an ID if none is provided', () => {
    const sut = new CustomEntity({ props: {} })
    expect(sut.id).toBeTruthy()
  })

  test('should use the provided ID if one is provided', () => {
    const sut = new CustomEntity({ props: {}, id: 'test-id' })
    expect(sut.id).toBe('test-id')
  })

  test('should be able to check for equality', () => {
    const sutOne = new CustomEntity({ props: {}, id: 'test-id' })
    const sutTwo = new CustomEntity({ props: {}, id: 'test-id' })

    class AnotherEntity {}
    const sutThree = new AnotherEntity()

    expect(sutOne.equals(sutTwo)).toBe(true)
    expect(sutOne.equals(sutThree as any)).toBe(false)
    expect(sutOne.equals(undefined)).toBe(false)
    expect(sutOne.equals(null)).toBe(false)
  })
})
