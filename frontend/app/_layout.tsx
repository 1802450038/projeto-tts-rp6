import '~/global.css'

import { type Theme, ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { SplashScreen, Stack } from 'expo-router'
import { NAV_THEME } from '~/lib/constants'
import { useLocalFonts } from './hooks/useLocalFonts'

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync()

const stackOptions = {
  statusBarColor: 'darkgreen',
  headerShown: false
}

export default function RootLayout() {
  const { loaded, error } = useLocalFonts()

  if (!loaded && !error) {
    return null
  }

  return (
    <ThemeProvider value={LIGHT_THEME}>
      <Stack screenOptions={stackOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/(auth)/sign-up/sign-up.page" />
        <Stack.Screen name="screens/upload-documents/upload-documents.page" />
        <Stack.Screen name="screens/tts/text-to-speech.page" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  )
}
