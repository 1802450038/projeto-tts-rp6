import { describe, expect, test } from 'vitest'
import { type SpeechMark, TimeSequenceHandler } from './pdf-sequence-handler'

const speechMark1: SpeechMark[] = [
  {
    time: 0,
    type: 'sentence',
    start: 7,
    end: 21,
    value: 'Olá, pessoas.'
  },
  {
    time: 24,
    type: 'viseme',
    value: 'o'
  },
  {
    time: 112,
    type: 'viseme',
    value: 't'
  },
  {
    time: 212,
    type: 'viseme',
    value: 'a'
  },
  {
    time: 437,
    type: 'viseme',
    value: 'sil'
  },
  {
    time: 512,
    type: 'viseme',
    value: 'p'
  },
  {
    time: 549,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 612,
    type: 'viseme',
    value: 's'
  },
  {
    time: 737,
    type: 'viseme',
    value: 'o'
  },
  {
    time: 887,
    type: 'viseme',
    value: 'a'
  },
  {
    time: 949,
    type: 'viseme',
    value: 's'
  },
  {
    time: 1162,
    type: 'viseme',
    value: 'sil'
  },
  {
    time: 1580,
    type: 'sentence',
    start: 22,
    end: 42,
    value: 'Tudo bem com vocês?'
  },
  {
    time: 1604,
    type: 'viseme',
    value: 't'
  },
  {
    time: 1642,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 1704,
    type: 'viseme',
    value: 't'
  },
  {
    time: 1754,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 1792,
    type: 'viseme',
    value: 'p'
  },
  {
    time: 1867,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 1954,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 1992,
    type: 'viseme',
    value: 'k'
  },
  {
    time: 2042,
    type: 'viseme',
    value: 'o'
  },
  {
    time: 2092,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 2117,
    type: 'viseme',
    value: 'f'
  },
  {
    time: 2167,
    type: 'viseme',
    value: 'o'
  },
  {
    time: 2217,
    type: 'viseme',
    value: 's'
  },
  {
    time: 2342,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 2442,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 2529,
    type: 'viseme',
    value: 's'
  },
  {
    time: 2729,
    type: 'viseme',
    value: 'sil'
  }
]

const speechMark2: SpeechMark[] = [
  {
    time: 500,
    type: 'sentence',
    start: 28,
    end: 44,
    value: 'Sim, tudo certo!'
  },
  {
    time: 524,
    type: 'viseme',
    value: 's'
  },
  {
    time: 687,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 937,
    type: 'viseme',
    value: 'sil'
  },
  {
    time: 987,
    type: 'viseme',
    value: 't'
  },
  {
    time: 1037,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 1112,
    type: 'viseme',
    value: 't'
  },
  {
    time: 1162,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 1212,
    type: 'viseme',
    value: 's'
  },
  {
    time: 1337,
    type: 'viseme',
    value: 'E'
  },
  {
    time: 1449,
    type: 'viseme',
    value: 't'
  },
  {
    time: 1512,
    type: 'viseme',
    value: 't'
  },
  {
    time: 1587,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 1712,
    type: 'viseme',
    value: 'sil'
  },
  {
    time: 2129,
    type: 'sentence',
    start: 45,
    end: 83,
    value: 'Porém, não sei se vocês estão bem.'
  },
  {
    time: 2154,
    type: 'viseme',
    value: 'p'
  },
  {
    time: 2204,
    type: 'viseme',
    value: 'o'
  },
  {
    time: 2267,
    type: 'viseme',
    value: 't'
  },
  {
    time: 2317,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 2467,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 2554,
    type: 'viseme',
    value: 'sil'
  },
  {
    time: 2580,
    type: 'viseme',
    value: 't'
  },
  {
    time: 2654,
    type: 'viseme',
    value: 'a'
  },
  {
    time: 2704,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 2742,
    type: 'viseme',
    value: 's'
  },
  {
    time: 2867,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 2917,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 2954,
    type: 'viseme',
    value: 's'
  },
  {
    time: 3054,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 3080,
    type: 'viseme',
    value: 'f'
  },
  {
    time: 3142,
    type: 'viseme',
    value: 'o'
  },
  {
    time: 3192,
    type: 'viseme',
    value: 's'
  },
  {
    time: 3304,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 3354,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 3404,
    type: 'viseme',
    value: 's'
  },
  {
    time: 3467,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 3504,
    type: 'viseme',
    value: 's'
  },
  {
    time: 3567,
    type: 'viseme',
    value: 't'
  },
  {
    time: 3617,
    type: 'viseme',
    value: 'a'
  },
  {
    time: 3680,
    type: 'viseme',
    value: 'u'
  },
  {
    time: 3729,
    type: 'viseme',
    value: 'p'
  },
  {
    time: 3792,
    type: 'viseme',
    value: 'e'
  },
  {
    time: 3904,
    type: 'viseme',
    value: 'i'
  },
  {
    time: 4017,
    type: 'viseme',
    value: 'sil'
  }
]

describe('PDF Sequence Handler', () => {
  test('should be able to correct speech marks sentences', () => {
    const handler = new TimeSequenceHandler()
    const processedMarks = handler.processFiles([speechMark1, speechMark2])

    const isWrongTime = processedMarks.some(
      (currentMark, i) => currentMark?.time > processedMarks?.[i + 1]?.time
    )

    expect(processedMarks.length === 4).toBeTruthy()
    expect(isWrongTime).toBeFalsy()
  })
})
