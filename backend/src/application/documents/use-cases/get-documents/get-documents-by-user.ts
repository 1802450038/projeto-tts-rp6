import { type Either, right } from '@/core/logic/either'
import type { Documents } from '../../domain/documents'
import type { IDocumentsRepository } from '../../repositories/IDocumentsRepository'

type GetDocumentsByUserRequest = {
  currentUserId: string
}

type GetDocumentsByUserResponse = Either<null, Documents[]>

export class GetDocumentsByUser {
  constructor(private readonly documentsRepository: IDocumentsRepository) {}

  async execute({
    currentUserId
  }: GetDocumentsByUserRequest): Promise<GetDocumentsByUserResponse> {
    const documents =
      await this.documentsRepository.getDocumentsByUserId(currentUserId)

    return right(documents)
  }
}
