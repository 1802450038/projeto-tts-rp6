import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { useEffect } from 'react'

export const fonts = [
  'Roboto',
  'Tinos',
  'Roboto Mono',
  'Roboto Serif',
  'Georgia',
  'Courier',
  'Times New Roman',
  'Open Dyslexic'
]

export type LocalFonts = (typeof fonts)[number]

export const useLocalFonts = () => {
  const [loaded, error] = useFonts({
    Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
    Tinos: require('../../assets/fonts/Tinos-Regular.ttf'),
    'Roboto Mono': require('../../assets/fonts/Roboto-Mono.ttf'),
    'Roboto Serif': require('../../assets/fonts/RobotoSerif-Regular.ttf'),
    Georgia: require('../../assets/fonts/Georgia.ttf'),
    Courier: require('../../assets/fonts/CourierPrime-Regular.ttf'),
    'Times New Roman': require('../../assets/fonts/Times-New-Roman.ttf'),
    'Open Dyslexic': require('../../assets/fonts/OpenDyslexic-Regular.otf')
  } satisfies Record<LocalFonts, string>)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  return { loaded, error }
}
