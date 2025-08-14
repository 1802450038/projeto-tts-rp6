import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: ['.env', '.env.local'], override: true })

const configs = z.object({
  PORT: z.coerce.number().optional(),
  BASE_URL: z.string().optional(),
  DATABASE_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  JWT_EXPIRES_IN: z.string().optional().default('3d'),
  DEV_MODE: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string()
})

export const env = configs.parse(process.env)
