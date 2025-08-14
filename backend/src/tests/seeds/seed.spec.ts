import { env } from '@/config'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Create seeds (end-to-end)', async () => {
  beforeAll(async () => {})

  test('should be truthy', async () => {
    if (!env.DEV_MODE || env.DEV_MODE === 'false') {
      expect(false).toBeTruthy()
      return
    }

    expect(true).toBeTruthy()
  })
})
