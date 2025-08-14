import type { Controller } from '@/core/infra/controller'
import { type HttpResponse, clientError, ok } from '@/core/infra/http-response'
import type { Validator } from '@/core/infra/validator'
import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type { ProcessUploadedFile } from './process-uploaded-file'

type ProcessUploadedFileControllerRequest = {
  currentUserId: string
  documentId?: string
  pageNumber?: number
  voiceId?: VoiceId
  languageCode?: LanguageCode
  engine?: 'neural' | 'standard'
}

export class ProcessUploadedFileController implements Controller {
  constructor(
    private readonly validator: Validator<ProcessUploadedFileControllerRequest>,
    private readonly processFile: ProcessUploadedFile
  ) {}

  async handle(
    request: ProcessUploadedFileControllerRequest
  ): Promise<HttpResponse> {
    const validated = this.validator.validate(request)

    if (validated.isLeft()) {
      return clientError(validated.value)
    }

    try {
      const result = await this.processFile.execute(request)

      if (result.isLeft()) {
        return clientError({ message: 'Erro ao processar o arquivo.' })
      }

      return ok({
        message: 'Arquivo processado com sucesso!',
        dto: {
          ...result.value.toResponseBody(),
          audioFiles: result.value
            .getAudioFiles()
            .map((audioFile) => audioFile.toResponseBody())
        }
      })
    } catch (err) {
      console.error(err)
      return clientError({ message: 'Erro de autenticação.' })
    }
  }
}
