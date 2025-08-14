import { PrismaDocumentsRepository } from '@/application/documents/repositories/prisma/PrismaDocumentsRepository'
import { PartialDocumentUpdate } from '@/application/documents/use-cases/process-uploaded-file/partial-update-document'
import { ProcessUploadedFile } from '@/application/documents/use-cases/process-uploaded-file/process-uploaded-file'
import { ProcessUploadedFileController } from '@/application/documents/use-cases/process-uploaded-file/process-uploaded-file.controller'
import type { Controller } from '@/core/infra/controller'
import { ValidatorCompositor } from '@/infra/validation/ValidatorCompositor'

export function makeProcessUploadedFilesController(): Controller {
  const documents = new PrismaDocumentsRepository()
  const partialDocumentUpdate = new PartialDocumentUpdate(documents)
  const processFile = new ProcessUploadedFile(documents, partialDocumentUpdate)

  const validator = new ValidatorCompositor([])

  return new ProcessUploadedFileController(validator, processFile)
}
