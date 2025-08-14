import { describe, expect, test } from 'vitest'
import { text } from './lorem-ipsum'
import { PDF } from './pdf'

const shouldSkip = false

describe('PDF to Text', () => {
  test.skipIf(shouldSkip)(
    'should be able to convert a PDF to text',
    async () => {
      const pdf = new PDF({ pathFile: './files/sample.pdf' })
      expect(pdf.getPage(0)).toBeTruthy()
    }
  )

  test('should be able to convert text to chunks (max 3000 chars)', async () => {
    const pdf = new PDF({ pathFile: './files/sample.pdf' })
    const _text = await pdf.toChunks(text)

    expect(_text.length < 3000).toBeTruthy()
  })

  test('should be able to remove inappropriate characters', async () => {
    const inputText =
      'Este é um teste! com @caracteres!!@#$%&*() especiais##, múltiplo!s pontos... e outros símbolos$$!!!!!!??? -Olá, mundo!'

    const pdf = new PDF({ pathFile: './files/sample.pdf' })
    const prettifiedText = pdf.filterIrrelevantCharacters(inputText)

    const expected =
      'Este é um teste com caracteres especiais, múltiplos pontos... e outros símbolos? \nOlá, mundo'

    expect(prettifiedText).toBe(expected)
  })
})
