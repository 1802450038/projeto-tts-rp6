import { DownloadFile } from '@/application/documents/use-cases/download-file/download-file'
import { DownloadFileController } from '@/application/documents/use-cases/download-file/download-file.controller'
import type { Controller } from '@/core/infra/controller'
import { ValidatorCompositor } from '@/infra/validation/ValidatorCompositor'

export function makeGetDownloadFileController(): Controller {
  const downloadFile = new DownloadFile()
  const validator = new ValidatorCompositor([])

  return new DownloadFileController(validator, downloadFile)
}
