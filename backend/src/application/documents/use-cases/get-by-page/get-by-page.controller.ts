import type { Controller } from '@/core/infra/controller'
import { type HttpResponse, clientError, ok } from '@/core/infra/http-response'
import type { Validator } from '@/core/infra/validator'
import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type { GetByPageNumber } from './get-by-page'

type GetByPageNumberControllerRequest = {
  currentUserId: string
  documentId: string
  pageNumber: number
  voiceId: VoiceId
  languageCode: LanguageCode
  engine?: 'neural' | 'standard'
}

export class GetByPageNumberController implements Controller {
  constructor(
    private readonly validator: Validator<GetByPageNumberControllerRequest>,
    private readonly getByPageNumber: GetByPageNumber
  ) {}

  async handle(
    request: GetByPageNumberControllerRequest
  ): Promise<HttpResponse> {
    const validated = this.validator.validate(request)

    if (validated.isLeft()) {
      return clientError(validated.value)
    }

    try {
      const result = await this.getByPageNumber.execute(request)

      if (result.isLeft()) {
        return clientError({ message: result.value.message })
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
