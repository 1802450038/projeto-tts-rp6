import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { ToastAndroid } from 'react-native'
import type { SignUpProps } from '~/app/screens/(auth)/sign-up/sign-up.schema'
import { UserStore, useUserStore } from '~/app/stores/useUserStore'
import { useMutate } from './useMutate'

type SignInProps = {
  email: string
  password: string
}

type SignUpResponse = {
  success: boolean;
  message: string;
};

export const useAuth = () => {
  const auth = useMutate<SignInProps>({
    url: '/auth/sign-in',
    method: 'post'
  })
  const createAccount = useMutate<SignUpProps>({
    url: '/auth/sign-up',
    method: 'post'
  })

  const signIn = async (props: SignInProps) => {
    await auth
      .mutateAsync(props)
      .then(async (data) => {
        await AsyncStorage.setItem('token', data.token)
        await AsyncStorage.setItem('userId', data.userId)
        await AsyncStorage.setItem('email', data.email)
        UserStore.setUser({ _id: data.userId, email: data.email })
        ToastAndroid.show('Login efetuado com sucesso!', ToastAndroid.SHORT)
        router.replace('/')
      })
      .catch((error: unknown) => {
        const axiosError = error as { response: { data: { message: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Erro ao cadastrar novo usuário.';
        ToastAndroid.show('Erro: '+errorMessage, ToastAndroid.SHORT)
        return { success: false, message: errorMessage };
      })
  }

  const signOut = () => {
    AsyncStorage.removeItem('token')
    AsyncStorage.removeItem('userId')
    AsyncStorage.removeItem('email')
    UserStore.setUser(null)
    router.replace('/')
  }

  const signUp = async (props: SignUpProps): Promise<SignUpResponse> => {
    try {
      const response = await createAccount.mutateAsync(props);
      return { success: true, message: 'Sucesso ao cadastrar novo usuário' };
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Erro ao cadastrar novo usuário.';
        return { success: false, message: errorMessage };
      }
      return { success: false, message: 'Erro ao cadastrar novo usuário.' };
    }
  };

  return {
    isPending: auth.isPending,
    signIn,
    signOut,
    signUp
  }
}
