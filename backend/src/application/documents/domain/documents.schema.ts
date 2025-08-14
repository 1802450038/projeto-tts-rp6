import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import { z } from 'zod'

export const UploadFileSchema = z.object({
  name: z.string().nullish(),
  currentPage: z.coerce.number().nullish(),
  voiceId: z.custom<VoiceId>().nullish(),
  languageCode: z.custom<LanguageCode>().nullish(),
  totalPages: z.coerce.number()
})

export type DocumentsProps = z.infer<typeof UploadFileSchema>
