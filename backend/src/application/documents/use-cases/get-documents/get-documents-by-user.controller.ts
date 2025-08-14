import type { Controller } from '@/core/infra/controller'
import { type HttpResponse, clientError, ok } from '@/core/infra/http-response'
import type { Validator } from '@/core/infra/validator'
import type { GetDocumentsByUser } from './get-documents-by-user'

type GetDocumentsByUserControllerRequest = {
  currentUserId: string
}

export class GetDocumentsByUserController implements Controller {
  constructor(
    private readonly validator: Validator<GetDocumentsByUserControllerRequest>,
    private readonly getDocumentsByUser: GetDocumentsByUser
  ) {}

  async handle(
    request: GetDocumentsByUserControllerRequest
  ): Promise<HttpResponse> {
    const validated = this.validator.validate(request)

    if (validated.isLeft()) {
      return clientError(validated.value)
    }

    try {
      const result = await this.getDocumentsByUser.execute(request)

      if (result.isLeft()) {
        return clientError({ message: 'Erro ao obter os documentos.' })
      }

      return ok({
        dto: result.value.map((document) => ({
          ...document.toResponseBody(),
          audioFiles: document.getAudioFiles().map((audioFile) => ({
            ...audioFile.toResponseBody(),
            speechMarks: JSON.parse(audioFile.props.speechMarks)
          }))
        }))
      })
    } catch (err) {
      console.error(err)
      return clientError({ message: 'Erro.' })
    }
  }
}
