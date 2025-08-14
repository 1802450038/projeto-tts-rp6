import { z } from 'zod'

export const UserSchema = z.object({
  name: z.string().max(64).nullish(),
  email: z.string().email(),
  password: z.string().min(3).max(64),
  phone: z.string().max(255).nullish()
})

export type UserProps = z.infer<typeof UserSchema>
