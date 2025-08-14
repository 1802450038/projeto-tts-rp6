import { type Either, left, right } from '@/core/logic/either'
import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type { Documents } from '../../domain/documents'
import type { IDocumentsRepository } from '../../repositories/IDocumentsRepository'
import type { ProcessUploadedFile } from '../process-uploaded-file/process-uploaded-file'

type GetByPageNumberRequest = {
  currentUserId: string
  documentId: string
  pageNumber: number
  voiceId: VoiceId
  languageCode: LanguageCode
  engine?: 'neural' | 'standard'
}

type ProcessUploadedFileResponse = Either<Error, Documents>

export class GetByPageNumber {
  constructor(
    private readonly documentsRepository: IDocumentsRepository,
    private readonly processFile: ProcessUploadedFile
  ) {}

  async execute({
    currentUserId,
    pageNumber = 0,
    documentId,
    languageCode,
    voiceId,
    engine
  }: GetByPageNumberRequest): Promise<ProcessUploadedFileResponse> {
    if (!documentId || !languageCode || !voiceId) {
      return left(new Error('Está faltando alguns atributos na request.'))
    }
    const document = await this.documentsRepository.findById(documentId)

    if (!document) {
      return left(new Error('Documento inválido.'))
    }

    try {
      const document = await this.processFile.execute({
        currentUserId,
        pageNumber,
        documentId,
        languageCode,
        voiceId,
        engine
      })

      if (document.isLeft()) {
        return left(document.value)
      }

      return right(document.value)
    } catch (error) {
      console.error('Falha ao processar o áudio: ', error)
      throw error
    }
  }
}
