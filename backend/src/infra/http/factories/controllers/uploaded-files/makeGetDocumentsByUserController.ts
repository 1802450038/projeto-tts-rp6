import { PrismaDocumentsRepository } from '@/application/documents/repositories/prisma/PrismaDocumentsRepository'
import { GetDocumentsByUser } from '@/application/documents/use-cases/get-documents/get-documents-by-user'
import { GetDocumentsByUserController } from '@/application/documents/use-cases/get-documents/get-documents-by-user.controller'
import type { Controller } from '@/core/infra/controller'
import { ValidatorCompositor } from '@/infra/validation/ValidatorCompositor'

export function makeGetDocumentsByUserController(): Controller {
  const documents = new PrismaDocumentsRepository()
  const getDocumentsByUser = new GetDocumentsByUser(documents)

  const validator = new ValidatorCompositor([])

  return new GetDocumentsByUserController(validator, getDocumentsByUser)
}
