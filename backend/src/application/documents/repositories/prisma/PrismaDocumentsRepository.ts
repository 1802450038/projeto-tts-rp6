import prismaClient from '@/infra/prisma/client'
import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type { AudioFile } from '../../domain/audio-file'
import type { Documents } from '../../domain/documents'
import type { DocumentsProps } from '../../domain/documents.schema'
import { AudioFileMapper } from '../../mapper/audio-file.mapper'
import { DocumentsMapper } from '../../mapper/documents.mapper'
import type {
  FindByIdOptions,
  IDocumentsRepository
} from '../IDocumentsRepository'

export class PrismaDocumentsRepository implements IDocumentsRepository {
  async findById(
    id: string,
    options?: FindByIdOptions
  ): Promise<Documents | null> {
    if (!id) return null

    const document = await prismaClient.documents.findUnique({
      where: {
        id
      },
      include: {
        audio_files: !!options?.includeAudioFiles
      }
    })

    if (!document) return null

    return DocumentsMapper.toDomain(document)
  }

  async create(
    document: Documents,
    audioFile: AudioFile,
    userId: string
  ): Promise<void> {
    const data = await DocumentsMapper.toPersistence(document)

    await prismaClient.documents.create({
      data: {
        id: document.id,
        name: data.name,
        user_id: userId,
        language_code: document.props.languageCode,
        voice_id: document.props.voiceId,
        audio_files: {
          connectOrCreate: {
            create: {
              id: audioFile.id,
              audio_file_path: audioFile.props.audioFilePath,
              page_number: audioFile.props.pageNumber,
              speech_marks: audioFile.props.speechMarks,
              current_paragraph: audioFile.props.currentParagraph
            },
            where: {
              id: document.id
            }
          }
        }
      }
    })
  }

  async partialUpdate(
    document: Partial<DocumentsProps>,
    documentId: string
  ): Promise<Documents | null> {
    if (!documentId) return null

    const data = await prismaClient.documents.update({
      data: {
        name: document.name,
        current_page: document.currentPage ?? 0,
        language_code: document.languageCode,
        voice_id: document.voiceId,
        total_pages: document.totalPages
      },
      where: {
        id: documentId
      }
    })

    return DocumentsMapper.toDomain(data)
  }

  async getAudioFileByModelInfo(
    currentUserId: string,
    pageNumber: number,
    documentId: string,
    voiceId: VoiceId,
    languageCode: LanguageCode
  ) {
    const pageModelLanguageCode = `${pageNumber}-${voiceId}-${languageCode}.mp3`

    const data = await prismaClient.audioFile.findFirst({
      where: {
        page_number: Number.isNaN(pageNumber) ? 0 : Number(pageNumber),
        document_id: documentId,
        audio_file_path: `audios/${currentUserId}/${documentId}-${pageModelLanguageCode}`
      }
    })

    if (!data) {
      return null
    }

    return AudioFileMapper.toDomain(data)
  }

  async update(document: Documents, audioFile: AudioFile, userId: string) {
    await prismaClient.documents.update({
      data: {
        name: document.props.name,
        current_page: document.props.currentPage ?? 0,
        language_code: document.props.languageCode,
        voice_id: document.props.voiceId,
        audio_files: {
          connectOrCreate: {
            create: {
              id: audioFile.id,
              audio_file_path: audioFile.props.audioFilePath,
              page_number: audioFile.props.pageNumber,
              speech_marks: audioFile.props.speechMarks,
              current_paragraph: audioFile.props.currentParagraph
            },
            where: {
              id: document.id,
              page_number: {
                /** Prevent duplicated audio files */
                not: audioFile.props.pageNumber
              }
            }
          }
        },
        user_id: userId
      },
      where: {
        id: document.id
      }
    })
  }

  async getDocumentsByUserId(userId: string): Promise<Documents[]> {
    const data = await prismaClient.documents.findMany({
      where: {
        user_id: userId
      },
      include: {
        audio_files: true
      }
    })

    return data.map((document) => DocumentsMapper.toDomain(document))
  }

  async deleteById(userId: string, documentId: string): Promise<void> {
    await prismaClient.audioFile.deleteMany({
      where: {
        document_id: documentId
      }
    })

    await prismaClient.documents.delete({
      where: {
        id: documentId,
        user_id: userId
      }
    })
  }
}
