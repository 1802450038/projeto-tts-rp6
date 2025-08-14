import { type Either, left, right } from '@/core/logic/either'
import type { IDocumentsRepository } from '../../repositories/IDocumentsRepository'

type DeleteFileRequest = {
  currentUserId: string
  documentId: string
}

type ProcessUploadedFileResponse = Either<Error, null>

export class DeleteFile {
  constructor(private readonly documentsRepository: IDocumentsRepository) {}

  async execute({
    documentId,
    currentUserId
  }: DeleteFileRequest): Promise<ProcessUploadedFileResponse> {
    if (!documentId || !currentUserId) {
      return left(new Error('Request inválida.'))
    }
    const document = await this.documentsRepository.findById(documentId)

    if (!document) {
      return left(new Error('Documento inválido.'))
    }

    try {
      await this.documentsRepository.deleteById(currentUserId, documentId)
      return right(null)
    } catch {
      return left(
        new Error(
          'Não foi possível deletar o documento. Tente novamente mais tarde.'
        )
      )
    }
  }
}
