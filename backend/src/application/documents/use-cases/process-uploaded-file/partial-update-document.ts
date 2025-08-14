import { type Either, left, right } from '@/core/logic/either'
import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type { Documents } from '../../domain/documents'
import type { IDocumentsRepository } from '../../repositories/IDocumentsRepository'

type PartialDocumentUpdateRequest = {
  currentUserId: string
  documentId: string
  pageNumber?: number
  voiceId?: VoiceId
  languageCode?: LanguageCode
}

type PartialDocumentUpdateResponse = Either<Error, Documents>

export class PartialDocumentUpdate {
  constructor(private readonly documentsRepository: IDocumentsRepository) {}

  async execute({
    currentUserId,
    pageNumber = 0,
    documentId,
    voiceId = 'Thiago',
    languageCode = 'pt-BR'
  }: PartialDocumentUpdateRequest): Promise<PartialDocumentUpdateResponse> {
    const document = await this.documentsRepository.findById(documentId, {
      includeAudioFiles: true
    })

    if (!document || !documentId) {
      return left(new Error('Documento inválido.'))
    }

    const audioFiles = await this.documentsRepository.getAudioFileByModelInfo(
      currentUserId,
      pageNumber,
      documentId,
      voiceId,
      languageCode
    )

    if (!audioFiles) {
      return left(new Error('Nenhum arquivo de áudio encontrado.'))
    }

    const newDocument = await this.documentsRepository.partialUpdate(
      {
        ...document.props,
        voiceId,
        languageCode,
        currentPage: Number.isNaN(pageNumber) ? 0 : Number(pageNumber)
      },
      documentId
    )
    newDocument?.setAudioFiles([audioFiles])

    if (!newDocument) {
      return left(new Error('Documento inválido.'))
    }

    return right(newDocument)
  }
}
