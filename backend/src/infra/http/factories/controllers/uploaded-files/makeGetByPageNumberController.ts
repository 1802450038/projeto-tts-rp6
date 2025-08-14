import { PrismaDocumentsRepository } from '@/application/documents/repositories/prisma/PrismaDocumentsRepository'
import { GetByPageNumber } from '@/application/documents/use-cases/get-by-page/get-by-page'
import { GetByPageNumberController } from '@/application/documents/use-cases/get-by-page/get-by-page.controller'
import { PartialDocumentUpdate } from '@/application/documents/use-cases/process-uploaded-file/partial-update-document'
import { ProcessUploadedFile } from '@/application/documents/use-cases/process-uploaded-file/process-uploaded-file'
import type { Controller } from '@/core/infra/controller'
import { ValidatorCompositor } from '@/infra/validation/ValidatorCompositor'

export function makeGetByPageNumberController(): Controller {
  const documents = new PrismaDocumentsRepository()
  const partialDocumentUpdate = new PartialDocumentUpdate(documents)
  const processFile = new ProcessUploadedFile(documents, partialDocumentUpdate)
  const getByPageNumber = new GetByPageNumber(documents, processFile)

  const validator = new ValidatorCompositor([])

  return new GetByPageNumberController(validator, getByPageNumber)
}
