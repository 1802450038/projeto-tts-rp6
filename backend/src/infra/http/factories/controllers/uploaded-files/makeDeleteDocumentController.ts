import { PrismaDocumentsRepository } from '@/application/documents/repositories/prisma/PrismaDocumentsRepository'
import { DeleteFile } from '@/application/documents/use-cases/delete-file/delete-file'
import { DeleteFileController } from '@/application/documents/use-cases/delete-file/delete-file.controller'
import type { Controller } from '@/core/infra/controller'
import { ValidatorCompositor } from '@/infra/validation/ValidatorCompositor'

export function makeDeleteDocumentController(): Controller {
  const documents = new PrismaDocumentsRepository()
  const deleteFile = new DeleteFile(documents)

  const validator = new ValidatorCompositor([])

  return new DeleteFileController(validator, deleteFile)
}
