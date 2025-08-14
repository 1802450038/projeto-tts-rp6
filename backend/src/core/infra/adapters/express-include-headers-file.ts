import fs from 'node:fs'
import type { Response } from 'express'
import type { HttpResponse } from '../http-response'

export const includeHeadersFile = (
  httpResponse: HttpResponse,
  response: Response
) => {
  const fileStream = httpResponse.body.fileStream

  if (!fileStream) {
    return response.status(400).json({ message: 'File stream not found.' })
  }
  const filePath = fileStream.path

  response.setHeader('Content-Type', 'audio/mpeg')
  response.setHeader('Content-Disposition', 'attachment; filename=audio.mp3')
  response.setHeader('Content-Length', fs.statSync(filePath).size)

  const file = fs.createReadStream(filePath)
  file.pipe(response)
}
