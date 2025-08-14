import type { AudioFile as PersistenceAudioFile } from '@prisma/client'
import { AudioFile } from '../domain/audio-file'

export const AudioFileMapper = {
  toDomain: (raw: PersistenceAudioFile) => {
    const audioFileOrError = AudioFile.create({
      props: {
        documentId: raw.document_id,
        audioFilePath: raw.audio_file_path,
        pageNumber: raw.page_number,
        speechMarks: raw.speech_marks as string,
        currentParagraph: raw.current_paragraph
      },
      id: raw.id
    })

    if (audioFileOrError.isLeft()) {
      throw new Error('Usuário inválido.')
    }

    return audioFileOrError.value
  },
  toPersistence: async (
    audioFile: AudioFile,
    documentId: string
  ): Promise<PersistenceAudioFile> => {
    return {
      id: audioFile.id,
      audio_file_path: audioFile.props.audioFilePath,
      page_number: audioFile.props.pageNumber,
      speech_marks: audioFile.props.speechMarks,
      current_paragraph: audioFile.props.currentParagraph,
      document_id: documentId
    }
  }
}
