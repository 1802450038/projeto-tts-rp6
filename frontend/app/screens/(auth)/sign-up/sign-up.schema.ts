import { z } from 'zod'

export const SignUpSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(4, { message: 'A senha deve conter ao menos 4 caracteres' })
    .max(32, { message: 'A senha não pode ter mais de 64 caracteres' }),
  confirmPassword: z
    .string()
    .min(4, { message: 'A senha deve conter ao menos 4 caracteres' })
    .max(32, { message: 'A senha não pode ter mais de 64 caracteres' }),
  isChecked: z.coerce
    .boolean({ message: 'Os termos devem ser aceitos.' })
    .refine((value) => value === true)
})

export type SignUpProps = z.infer<typeof SignUpSchema>
