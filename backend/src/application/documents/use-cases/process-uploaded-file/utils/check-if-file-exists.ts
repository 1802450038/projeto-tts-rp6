import fs from 'node:fs'
import path from 'path'

export type CheckIfFileExistsProps = {
  currentUserId: string
  documentId?: string
}

export const checkIfFileExists = (props: CheckIfFileExistsProps) => {
  const { currentUserId, documentId } = props

  try {
    const documentAlreadyUploaded = path.join(
      process.cwd(),
      `/audios/${currentUserId}/${documentId}.pdf`
    )

    if (fs.existsSync(documentAlreadyUploaded)) {
      return {
        pathFile: documentAlreadyUploaded,
        isDocumentAlreadyUploaded: true
      }
    }

    const pathFile = path.join(
      process.cwd(),
      `/audios/${currentUserId}/last-uploaded-${currentUserId}.pdf`
    )

    if (!fs.existsSync(pathFile)) {
      return false
    }

    return {
      pathFile,
      isDocumentAlreadyUploaded: false
    }
  } catch {
    return false
  }
}
