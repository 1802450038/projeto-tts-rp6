import { describe, expect, test } from 'vitest'
import { PollyService } from './polly-service'

/**
 * Tests to skip.
 */
const tests = {
  1: true,
  2: true,
  3: true
}

describe('AWS Polly SDK', () => {
  test.skipIf(tests[1])('should be able to synthesize speech', async () => {
    const result = await PollyService.synthesizeSpeech({
      text: 'Olá, pessoas. Tudo bem com vocês?',
      params: {}
    })
    console.log(result)

    expect(true).toBeTruthy()
  })

  test.skipIf(tests[2])(
    'should be able to synthesize speech and save speech marks as JSON',
    async () => {
      const speechMarks = await PollyService.synthesizeSpeechWithSpeechMarks({
        text: 'Olá, pessoas. Tudo bem com vocês?',
        params: {}
      })

      expect(speechMarks).toBeTruthy()
    }
  )

  test.skipIf(tests[3])(
    'should be able to return audio speech and marks as JSON',
    async () => {
      /**
       * Simulate a request body.
       */
      const text = 'Olá, pessoas. Tudo bem com vocês? Espero que sim!'

      const [audio, speechMarks] = await Promise.all([
        PollyService.synthesizeSpeech({
          text,
          params: {}
        }),
        PollyService.synthesizeSpeechWithSpeechMarks({
          text,
          params: {}
        })
      ])

      const dto = {
        audio,
        speechMarks
      }

      expect(dto).toHaveProperty('audio')
      expect(dto).toHaveProperty('speechMarks')
    }
  )
})
