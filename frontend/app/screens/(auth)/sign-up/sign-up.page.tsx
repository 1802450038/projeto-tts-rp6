import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ToastAndroid, View } from 'react-native'
import { AlertDialog } from '~/components/AlertDialog'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/useAuth'
import { cn } from '~/lib/utils'
import { type SignUpProps, SignUpSchema } from './sign-up.schema'

export const SignUp = () => {
  const { signUp } = useAuth()
  const [dialogVisible, setDialogVisible] = useState(false)

  const form = useForm<SignUpProps>({
    mode: 'onSubmit',
    resolver: zodResolver(SignUpSchema)
  })

  const showDialog = () => {
    setDialogVisible(true)
  }
  const handleNavigateToSignIn = () => {
    router.push({ pathname: '/screens/sign-in/sign-in' })
  }

  const onSubmit = async (data: SignUpProps) => {
    const { password, confirmPassword } = form.getValues();
  
    if (password !== confirmPassword) {
      ToastAndroid.show('As senhas não coincidem!', ToastAndroid.SHORT);
      return;
    }
  
    try {
      const response = await signUp(data); 
  
      if (response.success) {
        ToastAndroid.show(response.message, ToastAndroid.SHORT); 
        handleNavigateToSignIn();
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT); 
        handleNavigateToSignIn();
      }
    } catch (error) {
      ToastAndroid.show('Erro ao cadastrar usuário.', ToastAndroid.SHORT); 
    }
  };
  
  

  const onError = (error: keyof SignUpProps, errorMessage: string) => {
    const hasError = !!form.formState.errors[error]
    return hasError ? errorMessage : null
  }

  return (
    <View className="flex-1 justify-center items-center gap-5 p-2 bg-secondary/30">
      <View className="flex flex-col">
        <CardTitle className="pb-4 flex gap-2 text-5xl text-gray-500">
          Pampa Reader
        </CardTitle>
        <CardTitle className="pb-2 flex gap-2 text-4xl text-gray-500">
          IA Reader
        </CardTitle>
        <CardDescription className="text-2xl text-gray-400">
          Cadastre-se
        </CardDescription>
      </View>
      <Card className="w-full max-w-md py-6 px-2 rounded-2xl">
        <CardContent>
          <View className="flex flex-col gap-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  errorMessage={onError('email', 'Formato de e-mail inválido.')}
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
                  errorMessage={onError('password', 'Senha inválida.')}
                  label="Senha"
                  placeholder="●●●●●●●"
                  secureTextEntry
                  isRequired
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  errorMessage={onError('confirmPassword', 'Senha inválida.')}
                  label="Confirmar Senha"
                  placeholder="●●●●●●●"
                  secureTextEntry
                  isRequired
                />
              )}
            />
            <View className="flex flex-row items-center gap-2">
              <Controller
                name="isChecked"
                defaultValue={false}
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <View className="flex gap-0">
                <Text
                  className={cn('text-gray-500')}
                  onPress={() =>
                    form.setValue('isChecked', !form.getValues().isChecked)
                  }
                >
                  Concordo com os termos da aplicação{' '}
                </Text>
                <AlertDialog
                  title="Termos de Serviço"
                  description="1.Uso do Aplicativo:
O aplicativo é fornecido para uso pessoal, e seu acesso está sujeito às leis aplicáveis. É proibido o uso comercial sem autorização prévia.
2.Coleta de Dados:
O aplicativo pode coletar informações básicas do usuário para aprimorar a experiência e fornecer suporte técnico. Leia nossa Política de Privacidade para mais detalhes.
3.Limitações de Responsabilidade:
Embora nos esforcemos para oferecer uma experiência sem falhas, não garantimos que o serviço será ininterrupto ou livre de erros.
4.Direitos Autorais:
Todo o conteúdo disponibilizado pelo aplicativo está protegido pelas leis de direitos autorais.
5.Aceitação:
Ao se cadastrar, você declara que leu, entendeu e concorda com estes Termos de Serviço."
                  isOpen={dialogVisible}
                  onOpenChange={setDialogVisible}
                >
                  <Text
                    className="text-blue-500 underline -my-1"
                    onPress={showDialog}
                  >
                    Dos termos
                  </Text>
                </AlertDialog>
                {form.formState.errors.isChecked && (
                  <Text className="text-xs text-destructive">Obrigatório</Text>
                )}
              </View>
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-3 pb-0">
          <Button
            className="bg-black text-white w-full py-4 text-lg rounded-xl shadow-lg"
            onPress={form.handleSubmit(onSubmit)}
          >
            <Text>Cadastrar</Text>
          </Button>
          <Link href={{ pathname: '/' }}>
            Já possui uma conta?{' '}
            <Text className="text-blue-500 underline">Entrar</Text>
          </Link>
        </CardFooter>
      </Card>
    </View>
  )
}

export default SignUp

