import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Loading } from './components/LoadingComponents'
import SignIn from './screens/(auth)/sign-in/sign-in'
import { UserStore } from './stores/useUserStore'

export default function Screen() {
  const [isMounted, setMounted] = useState(false)
  const router = useRouter()

  const getToken = useCallback(async () => {
    const token = await AsyncStorage.getItem('token')
    const userId = await AsyncStorage.getItem('userId')
    setMounted(true)
    return { token, userId }
  }, [])

  useEffect(() => {
    getToken().then(({ token, userId }) => {
      if (token && userId) {
        UserStore.setUser({ _id: userId })
        router.replace('/screens/upload-documents/upload-documents.page')
      }
    })
  }, [getToken, router])

  if (!isMounted) {
    return <Loading />
  }

  return <SignIn />
}
