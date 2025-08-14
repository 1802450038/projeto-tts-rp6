import type { Controller } from '@/core/infra/controller'
import { type HttpResponse, clientError, ok } from '@/core/infra/http-response'
import type { Validator } from '@/core/infra/validator'
import type { DeleteFile } from './delete-file'

type DeleteFileControllerControllerRequest = {
  currentUserId: string
  documentId: string
}

export class DeleteFileController implements Controller {
  constructor(
    private readonly validator: Validator<DeleteFileControllerControllerRequest>,
    private readonly deleteFile: DeleteFile
  ) {}

  async handle(
    request: DeleteFileControllerControllerRequest
  ): Promise<HttpResponse> {
    const validated = this.validator.validate(request)

    if (validated.isLeft()) {
      return clientError(validated.value)
    }

    try {
      const result = await this.deleteFile.execute(request)

      if (result.isLeft()) {
        return clientError({ message: result.value.message })
      }

      return ok({
        message: 'Arquivo deletado com sucesso!'
      })
    } catch (err) {
      console.error(err)
      return clientError({ message: 'Erro ao deletar o arquivo.' })
    }
  }
}
