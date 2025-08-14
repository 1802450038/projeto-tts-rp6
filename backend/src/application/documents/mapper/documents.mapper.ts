import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import type {
  AudioFile as PersistenceAudioFile,
  Documents as PersistenceDocuments
} from '@prisma/client'
import { Documents } from '../domain/documents'
import { AudioFileMapper } from './audio-file.mapper'

type DocumentsProps = PersistenceDocuments & {
  audio_files?: PersistenceAudioFile[]
}

export const DocumentsMapper = {
  toDomain: (raw: DocumentsProps) => {
    const audioFiles = raw.audio_files?.map(AudioFileMapper.toDomain)

    const userOrError = Documents.create(
      {
        props: {
          name: raw.name,
          currentPage: raw.current_page,
          languageCode: raw.language_code as LanguageCode,
          voiceId: raw.voice_id as VoiceId,
          totalPages: raw.total_pages
        },
        id: raw.id
      },
      audioFiles ?? []
    )

    if (userOrError.isLeft()) {
      throw new Error('Usuário inválido.')
    }

    return userOrError.value
  },
  toPersistence: async (document: Documents) => {
    return {
      id: document.id,
      name: document.props.name as string | null,
      current_page: document.props.currentPage as number | null,
      language_code: document.props.languageCode as string | null,
      voice_id: document.props.voiceId as string | null,
      total_pages: document.props.totalPages as number | null
    }
  }
}
