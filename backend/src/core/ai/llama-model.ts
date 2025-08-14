import path from 'node:path'
import { LlamaChatSession, getLlama } from 'node-llama-cpp'

const __dirname = path.dirname(__filename)
const modelPath = path.join(
  __dirname,
  '../../../models/hf_bartowski_Phi-3.1-mini-4k-instruct-Q4_K_M.gguf'
)

type LlamaModelOptions = {
  systemPrompt?: string
}

export class LlamaModel {
  static async getSession(
    options: LlamaModelOptions = {}
  ): Promise<LlamaChatSession> {
    const llama = await getLlama()
    const model = await llama.loadModel({ modelPath })
    const context = await model.createContext()

    return new LlamaChatSession({
      systemPrompt:
        'Você é um assistente de texto profissional. Você busca por títulos em documentos de texto. Você não faz perguntas e não responde com nenhuma outra informação.',
      ...options,
      contextSequence: context.getSequence()
    })
  }

  static async getLanguageSession(
    options: LlamaModelOptions = {}
  ): Promise<LlamaChatSession> {
    const llama = await getLlama()
    const model = await llama.loadModel({ modelPath })
    const context = await model.createContext()

    return new LlamaChatSession({
      systemPrompt:
        'Você é um assistente de linguagem. Você não faz perguntas e não responde com nenhuma outra informação. Você só responde "Português", "English" ou "German" para os textos que eu enviar. Caso o texto não seja em português, inglês ou alemão, você responde "Não sei".',
      ...options,
      contextSequence: context.getSequence()
    })
  }
}
