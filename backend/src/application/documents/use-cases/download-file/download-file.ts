import fs from 'node:fs'
import { type Either, left, right } from '@/core/logic/either'
import type { DownloadFileRequest } from './download-file.schema'

type DownloadFileResponse = Either<Error, fs.ReadStream>

export class DownloadFile {
  async execute(request: DownloadFileRequest): Promise<DownloadFileResponse> {
    const path = request.filePath

    if (!fs.existsSync(path)) {
      return left(new Error('Arquivo não encontrado.'))
    }

    const fileStream = fs.createReadStream(path)
    return right(fileStream)
  }
}
