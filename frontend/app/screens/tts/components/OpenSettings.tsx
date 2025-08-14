import { Settings2 } from 'lucide-react-native'
import { Pressable } from 'react-native'
import { useSettingsFontDrawerStore } from '~/app/stores/useFontSettingsDrawerStore'

export const OpenSettings = () => {
  const isFontDrawerVisible = useSettingsFontDrawerStore(
    (state) => state.isFontDrawerVisible
  )
  const setFontDrawerVisible = useSettingsFontDrawerStore(
    (state) => state.setFontDrawerVisible
  )

  return (
    <Pressable
      className="w-10 h-10 bg-black rounded-full items-center justify-center shadow-lg"
      onPress={() => {
        setFontDrawerVisible(!isFontDrawerVisible)
      }}
    >
      <Settings2 size={24} color="#29c97e" />
    </Pressable>
  )
}
