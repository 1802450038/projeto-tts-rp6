import fs from 'node:fs'

type CleanupFilesProps = {
  currentUserId: string
  documentId: string
  pageNumber: number
  voiceId: string
  languageCode: string
  chunks: string[]
}

export const cleanupAndRenameFiles = (props: CleanupFilesProps) => {
  const {
    currentUserId,
    documentId,
    pageNumber,
    voiceId,
    languageCode,
    chunks
  } = props
  const modelInfo = `${voiceId}-${languageCode}`
  const defaultPath = `./audios/last-uploaded-${currentUserId}.pdf`

  if (fs.existsSync(defaultPath)) {
    fs.renameSync(defaultPath, `./audios/${currentUserId}/${documentId}.pdf`)
  }

  for (let i = 0; i < chunks.length; i++) {
    const path = `./audios/${currentUserId}/page-${i}.mp3`

    if (chunks.length === 1) {
      fs.renameSync(
        path,
        `./audios/${currentUserId}/${documentId}-${pageNumber}-${modelInfo}.mp3`
      )
      break
    }

    if (fs.existsSync(path)) {
      fs.unlinkSync(path)
    }
  }
}
