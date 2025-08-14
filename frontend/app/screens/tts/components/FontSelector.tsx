import { Check, ChevronLeft, X } from 'lucide-react-native'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { type LocalFonts, fonts } from '~/app/hooks/useLocalFonts'
import { useSettingsFontDrawerStore } from '~/app/stores/useFontSettingsDrawerStore'

export const FontSelector = () => {
  const selectedFont = useSettingsFontDrawerStore((state) => state.selectedFont)
  const setSelectedFont = useSettingsFontDrawerStore(
    (state) => state.setSelectedFont
  )
  const setFontSelectorVisible = useSettingsFontDrawerStore(
    (state) => state.setFontSelectorVisible
  )

  const onClose = () => {
    setFontSelectorVisible(false)
  }

  const onSelectFont = (font: LocalFonts) => {
    setSelectedFont(font)
    onClose()
  }

  return (
    <View className="flex-1 bg-black/30">
      <View className="flex-1 mt-auto bg-white rounded-t-3xl max-h-[60%]">
        <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
          <Pressable onPress={onClose} className="p-2">
            <ChevronLeft size={24} color="#000" />
          </Pressable>
          <Text
            className="text-xl font-medium ml-2 gap-2"
            // style={{ fontFamily: selectedFont }}
          >
            Fontes
          </Text>
          <Pressable onPress={onClose} className="ml-auto p-2">
            <X size={24} color="#000" />
          </Pressable>
        </View>
        <ScrollView className="flex-1 px-4">
          {fonts.map((font) => (
            <Pressable
              key={font}
              onPress={() => onSelectFont(font as LocalFonts)}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <Text className={'text-lg'}>{font}</Text>
              {selectedFont === font && <Check size={24} color="#6366f1" />}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
