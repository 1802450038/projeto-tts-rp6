import path from 'node:path'
import { type Either, left, right } from '@/core/logic/either'
import { PDF } from '@/core/pdf/pdf'
import { TimeSequenceHandler } from '@/core/pdf/pdf-sequence-handler'
import { PollyService } from '@/infra/services/aws/polly-service'
import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import { AudioFile } from '../../domain/audio-file'
import { Documents } from '../../domain/documents'
import type { IDocumentsRepository } from '../../repositories/IDocumentsRepository'
import type { PartialDocumentUpdate } from './partial-update-document'
import { checkIfFileExists } from './utils/check-if-file-exists'
import { cleanupAndRenameFiles } from './utils/cleanup-and-rename-files'
import { mergeAudioFiles } from './utils/merge-files'

type ProcessUploadedFileRequest = {
  currentUserId: string
  documentId?: string
  pageNumber?: number
  voiceId?: VoiceId
  languageCode?: LanguageCode
  engine?: 'neural' | 'standard'
}

type ProcessUploadedFileResponse = Either<Error, Documents>

export class ProcessUploadedFile {
  constructor(
    private readonly documentsRepository: IDocumentsRepository,
    private readonly partialDocumentUpdate: PartialDocumentUpdate
  ) {}

  async execute({
    currentUserId,
    voiceId = 'Ricardo',
    languageCode = 'pt-BR',
    pageNumber = 0,
    documentId,
    engine = 'standard'
  }: ProcessUploadedFileRequest): Promise<ProcessUploadedFileResponse> {
    const fileExists = checkIfFileExists({
      currentUserId,
      documentId
    })

    if (!fileExists) {
      return left(new Error('Erro de processamento. Arquivo não encontrado.'))
    }

    if (fileExists.isDocumentAlreadyUploaded && documentId) {
      const document = await this.partialDocumentUpdate.execute({
        currentUserId,
        documentId,
        pageNumber,
        voiceId,
        languageCode
      })

      if (document.isRight()) {
        return right(document.value)
      }
    }

    const pathFile = fileExists.pathFile
    const pdfParser = new PDF({ pathFile })
    const metadata = await pdfParser.getMetadata()
    const totalPages = pdfParser.getTotalPages()
    const page = await pdfParser.getPrettifiedPage(pageNumber)
    const chunks = await pdfParser.toChunks(page)

    const documentOrError = Documents.create(
      {
        props: {
          name: metadata.Title ?? 'Documento sem titulo',
          currentPage: pageNumber,
          voiceId,
          languageCode,
          totalPages
        },
        id: documentId
      },
      []
    )

    if (documentOrError.isLeft()) {
      return left(documentOrError.value)
    }

    try {
      const outputDir = path.join(process.cwd(), `/audios/${currentUserId}`)
      console.log('Preparando para sintetizar arquivo...')

      const audioAndSpeechMarks = await Promise.all(
        chunks.map((chunk, index) =>
          PollyService.synthesizeAndGetSpeechMarks({
            text: chunk,
            params: {
              PathFile: `${currentUserId}/page-${index}`,
              LanguageCode: languageCode,
              VoiceId: voiceId,
              Engine: engine
            }
          })
        )
      )
      const files = Array.from({ length: chunks.length }).map((_, index) =>
        path.join(outputDir, `page-${index}.mp3`)
      )
      const modelInfo = `${voiceId}-${languageCode}`

      const outputPath = path.join(
        outputDir,
        `${documentOrError.value.id}-${pageNumber}-${modelInfo}.mp3`
      )

      await mergeAudioFiles(files, outputPath)
      const timeSequenceHandler = new TimeSequenceHandler()

      const sentences = timeSequenceHandler.processFiles(
        audioAndSpeechMarks.map(({ speechMarks }) => speechMarks)
      )

      const audioFilesOrError = AudioFile.create({
        props: {
          pageNumber,
          currentParagraph: 0,
          speechMarks: JSON.stringify({ sentences }),
          audioFilePath: `audios/${currentUserId}/${documentOrError.value.id}-${pageNumber}-${modelInfo}.mp3`
        }
      })

      if (audioFilesOrError.isLeft()) {
        return left(audioFilesOrError.value)
      }

      documentOrError.value.setAudioFiles([audioFilesOrError.value])

      await this.documentsRepository[documentId ? 'update' : 'create'](
        documentOrError.value,
        audioFilesOrError.value,
        currentUserId
      )

      cleanupAndRenameFiles({
        currentUserId,
        documentId: documentOrError.value.id,
        pageNumber,
        voiceId,
        languageCode,
        chunks
      })

      return right(documentOrError.value)
    } catch (error) {
      console.error('Falha ao processar o áudio: ', error)
      throw error
    }
  }
}
