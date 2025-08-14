import type { Controller } from '@/core/infra/controller'
import { type HttpResponse, clientError, ok } from '@/core/infra/http-response'
import type { Validator } from '@/core/infra/validator'
import type { DownloadFile } from './download-file'
import {
  type DownloadFileRequest,
  downloadFileSchema
} from './download-file.schema'

export class DownloadFileController implements Controller {
  constructor(
    private readonly validator: Validator<DownloadFileRequest>,
    private readonly downloadFile: DownloadFile
  ) {}

  async handle(request: DownloadFileRequest): Promise<HttpResponse> {
    const validated = this.validator.validate(request)
    const isRequestValid = downloadFileSchema.safeParse(request)

    if (validated.isLeft() || !isRequestValid.success) {
      return clientError(validated.value || isRequestValid.error)
    }

    try {
      const result = await this.downloadFile.execute(request)

      if (result.isLeft()) {
        return clientError({ message: result.value.message })
      }

      return ok({
        message: 'Arquivo baixado com sucesso!',
        fileStream: result.value
      })
    } catch (err) {
      console.error(err)
      return clientError({ message: 'Erro de autenticação.' })
    }
  }
}
