import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { LogIn } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/useAuth'
import { type SignInProps, SignInSchema } from './sign-in.schema'
import { useState } from 'react';

export const SignIn = () => {
  const router = useRouter()
  const { signIn, isPending } = useAuth()

  const form = useForm<SignInProps>({
    mode: 'onSubmit',
    resolver: zodResolver(SignInSchema)
  })

  const handleNavigateToSignUp = () => {
    router.push({ pathname: '/screens/sign-up/sign-up.page' })
  }

  const onSubmit = async () => {
    await form.handleSubmit(signIn)()
  }

  return (
    <View className="flex-1 justify-center items-center gap-5 p-2 bg-secondary/30">
      <Card className="w-full max-w-md py-6 px-2 rounded-2xl">
        <CardHeader>
          <View className="flex flex-col">
            <CardTitle className="pb-2 flex gap-2">Entrar</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col gap-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  errorMessage={form.formState.errors.email?.message}
                  label="Email"
                  placeholder="email@exemplo.com"
                  isRequired
                />
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  errorMessage={form.formState.errors.password?.message}
                  label="Senha"
                  placeholder="●●●●●●●"
                  textContentType="password"
                  secureTextEntry
                  isRequired
                />
              )}
            />
          </View>
        </CardContent>
        <CardFooter className="flex flex-col justify-end pb-1">
          <Button
            variant="outline"
            className="mt-4 shadow shadow-foreground/5 rounded-xl w-full"
            onPress={onSubmit}
            startContent={<LogIn size={22} color="#29c97e" />}
            disabled={isPending}
          >
            <Text>Entrar</Text>
          </Button>
          <Button
            variant="link"
            className="mt-2 text-center w-full text-primary"
            onPress={handleNavigateToSignUp}
          >
            <Text>Cadastrar-se</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  )
}

export default SignIn
