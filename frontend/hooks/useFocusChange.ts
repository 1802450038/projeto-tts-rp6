import AsyncStorage from '@react-native-async-storage/async-storage'
import { SplashScreen, useNavigation, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { UserStore } from '~/app/stores/useUserStore'

type useFocusChangeProps = {
  refetch: () => void
}

SplashScreen.preventAutoHideAsync()

export const useFocusChange = ({ refetch }: useFocusChangeProps) => {
  const navigation = useNavigation()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const userId = await AsyncStorage.getItem('userId')
      const email = await AsyncStorage.getItem('email')

      if (!userId) {
        router.replace('/')
        return
      }
      UserStore.setUser({ _id: userId, email: email || '' })
      refetch()
    })

    return unsubscribe
  }, [navigation, refetch, router])
}
