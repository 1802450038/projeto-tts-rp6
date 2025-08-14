import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { env } from '@/config'
import {
  Polly,
  SynthesizeSpeechCommand,
  type SynthesizeSpeechCommandInput
} from '@aws-sdk/client-polly'

export const pollyClient = new Polly({
  region: 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
})

const defaultCommand: SynthesizeSpeechCommandInput = {
  Text: '',
  TextType: 'text',
  OutputFormat: 'mp3',
  LanguageCode: 'pt-BR',
  VoiceId: 'Thiago',
  Engine: 'neural'
}

type PollyServiceParamsWithFile = {
  text: string
  params?: Partial<SynthesizeSpeechCommandInput> & {
    CreateFile?: boolean
    PathFile?: string
  }
}

type PollyServiceResponse = {
  time: number
  type: 'sentence' | 'viseme'
  start: number
  end: number
  value: string
}

export class PollyService {
  static async synthesizeSpeech({
    text,
    params
  }: PollyServiceParamsWithFile): Promise<Readable> {
    if (!text || text.trim() === '') {
      throw new Error('Texto inválido.')
    }

    const audioCommand = new SynthesizeSpeechCommand({
      ...defaultCommand,
      ...params,
      Text: text
    })
    const audioData = await pollyClient.send(audioCommand)
    const rootPath = path.join(process.cwd(), './audios')

    if (audioData.AudioStream instanceof Readable) {
      const audioChunks: Buffer[] = []

      for await (const chunk of audioData.AudioStream) {
        audioChunks.push(chunk)
      }
      const audioBuffer = Buffer.concat(audioChunks)

      if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath)
      }

      if (params?.PathFile) {
        fs.writeFileSync(`./audios/${params?.PathFile}.mp3`, audioBuffer)
      }

      return audioData.AudioStream as Readable
    }

    throw new Error('Falha na sintetização.')
  }

  static async synthesizeSpeechWithSpeechMarks({
    text,
    params
  }: PollyServiceParamsWithFile): Promise<PollyServiceResponse[]> {
    if (!text || text.trim() === '') {
      throw new Error('Texto inválido.')
    }

    const marksParams: SynthesizeSpeechCommandInput = {
      ...defaultCommand,
      ...params,
      Text: text,
      OutputFormat: 'json',
      SpeechMarkTypes: ['sentence', 'viseme']
    }
    const marksCommand = new SynthesizeSpeechCommand(marksParams)
    const marksData = await pollyClient.send(marksCommand)

    if (marksData.AudioStream instanceof Readable) {
      const marksChunks: string[] = []

      for await (const chunk of marksData.AudioStream) {
        marksChunks.push(chunk.toString())
      }

      const speechMarks = marksChunks
        .join('')
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => JSON.parse(line))

      if (params?.PathFile) {
        fs.writeFileSync(
          `./audios/${params?.PathFile}.json`,
          JSON.stringify(speechMarks, null, 2)
        )
      }

      return speechMarks as PollyServiceResponse[]
    }

    return []
  }

  static async synthesizeAndGetSpeechMarks({
    text,
    params
  }: PollyServiceParamsWithFile) {
    const [audio, speechMarks] = await Promise.all([
      PollyService.synthesizeSpeech({ text, params }),
      PollyService.synthesizeSpeechWithSpeechMarks({
        text,
        params: {
          ...params,
          PathFile: undefined
        }
      })
    ])

    return { audio, speechMarks }
  }
}
