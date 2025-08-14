import { z } from 'zod'

export const downloadFileSchema = z.object({
  filePath: z.string()
})

export type DownloadFileRequest = z.infer<typeof downloadFileSchema>
