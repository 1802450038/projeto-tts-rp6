import { LlamaModel } from '@/core/ai/llama-model'
import { describe, expect, test } from 'vitest'

const shouldTest = false

describe('Llama Model', () => {
  test('should correct a text', async () => {
    if (!shouldTest) return
    const session = await LlamaModel.getSession({
      systemPrompt:
        'Você é um assistente profissional de texto. Você corrige erros gramaticais e ortográficos. Você não faz perguntas e não responde com nenhuma outra informação.'
    })

    const prompt = 'querro que voce corrige essi testo'
    const response = await session.prompt(prompt)

    const expected = 'Quero que você corrija esse texto.'
    console.log([{ prompt }, { expected, actual: response }])

    expect(response).toBe(expected)
  })

  test('should be able to detect language', async () => {
    if (!shouldTest) return

    const session = await LlamaModel.getLanguageSession()

    const prompt = 'Olá, tudo bem?'
    const response = await session.prompt(prompt)

    const prompt2 = 'Hello, how are you? I am fine.'
    const response2 = await session.prompt(prompt2)

    const prompt3 = 'Ich bin ein Assistent. Ich kann keine Fragen stellen.'
    const response3 = await session.prompt(prompt3)

    const prompt4 = 'Hyta förälder, vad är detta?'
    const response4 = await session.prompt(prompt4)

    expect(response).toBe('Português')
    expect(response2).toBe('English')
    expect(response3).toBe('German')
    expect(response4).toBe('Não sei')
  })
})
