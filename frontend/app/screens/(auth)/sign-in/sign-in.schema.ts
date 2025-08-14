import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(4, 'A senha deve conter ao menos 4 caracteres')
    .max(64, 'A senha não pode ter mais de 64 caracteres')
})

export type SignInProps = z.infer<typeof SignInSchema>
