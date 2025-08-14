import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type { AudioFile } from '../domain/audio-file'
import type { Documents } from '../domain/documents'
import type { DocumentsProps } from '../domain/documents.schema'

export type FindByIdOptions = {
  includeAudioFiles?: boolean
}

export interface IDocumentsRepository {
  findById(id?: string, options?: FindByIdOptions): Promise<Documents | null>
  create(
    document: Documents,
    audioFile: AudioFile,
    userId: string
  ): Promise<void>
  update(
    document: Documents,
    audioFile: AudioFile,
    userId: string
  ): Promise<void>
  partialUpdate(
    document: Partial<DocumentsProps>,
    documentId: string
  ): Promise<Documents | null>
  getDocumentsByUserId(userId: string): Promise<Documents[]>
  getAudioFileByModelInfo(
    currentUserId: string,
    pageNumber: number,
    documentId: string,
    voiceId: VoiceId,
    languageCode: LanguageCode
  ): Promise<AudioFile | null>
  deleteById(userId: string, documentId: string): Promise<void>
}
