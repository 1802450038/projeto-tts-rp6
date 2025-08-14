import { LoaderCircle } from 'lucide-react-native'
import { View } from 'react-native'

export const Loading = () => {
  return (
    <View className="flex items-center justify-center animate-spin h-full">
      <LoaderCircle size={64} color="#29c97e" />
    </View>
  )
}
