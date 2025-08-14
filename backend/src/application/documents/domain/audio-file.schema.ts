import { z } from 'zod'

export const AudioFileSchema = z.object({
  currentParagraph: z.coerce.number().default(0),
  pageNumber: z.coerce.number().default(0),
  speechMarks: z.string(),
  audioFilePath: z.string(),
  documentId: z.string().optional()
})

export type AudioFileProps = z.infer<typeof AudioFileSchema>
