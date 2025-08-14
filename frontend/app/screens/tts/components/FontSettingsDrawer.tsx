import { ChevronRight, Minus, Plus, X } from 'lucide-react-native'
import { Modal, Pressable, Text, View } from 'react-native'
import {
  SettingsDrawerStore,
  useSettingsFontDrawerStore
} from '~/app/stores/useFontSettingsDrawerStore'
import { FontSelector } from './FontSelector'

export const FontSettingsDrawer = () => {
  const selectedFont = useSettingsFontDrawerStore((state) => state.selectedFont)
  const currentFontSize = useSettingsFontDrawerStore(
    (state) => state.currentFontSize
  )
  const isFontDrawerVisible = useSettingsFontDrawerStore(
    (state) => state.isFontDrawerVisible
  )
  const isFontSelectorVisible = useSettingsFontDrawerStore(
    (state) => state.isFontSelectorVisible
  )
  const setFontSelectorVisible = useSettingsFontDrawerStore(
    (state) => state.setFontSelectorVisible
  )

  const onClose = () => {
    SettingsDrawerStore.setFontDrawerVisible(false)
  }

  const onChangeFontSize = (size: number) => {
    SettingsDrawerStore.setCurrentFontSize(size)
  }

  return (
    <Modal
      visible={isFontDrawerVisible}
      animationType="slide"
      transparent={true}
    >
      {isFontSelectorVisible ? (
        <FontSelector />
      ) : (
        <View className="flex-1 bg-black/30">
          <View className="flex-1 mt-auto bg-white rounded-t-3xl max-h-[45%]">
            <View className="px-6 py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="text-xl font-medium flex-1">
                  Alterar o aspeto
                </Text>
                <Pressable onPress={onClose} className="p-2">
                  <X size={24} color="#000" />
                </Pressable>
              </View>
            </View>
            <View className="p-6 space-y-6">
              <Pressable
                className="flex-row items-center justify-between bg-gray-50 px-4 py-3 rounded-xl"
                onPress={() => setFontSelectorVisible(true)}
              >
                <Text className="text-lg">Tipo de letra</Text>
                <View className="flex-row items-center">
                  <Text className="text-lg text-gray-500 mr-2">
                    {selectedFont}
                  </Text>
                  <ChevronRight size={24} color="#666" />
                </View>
              </Pressable>
              <View className="bg-gray-50 px-4 py-3 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg">Tamanho</Text>
                  <View className="flex-row items-center space-x-4">
                    <Text className="text-lg text-gray-500">
                      {currentFontSize} pt
                    </Text>
                    <View className="flex-row items-center bg-white rounded-lg gap-2">
                      <Pressable
                        className="p-2"
                        onPress={() =>
                          onChangeFontSize(Math.max(16, currentFontSize - 2))
                        }
                      >
                        <Minus size={24} color="#000" />
                      </Pressable>
                      <Pressable
                        className="p-2"
                        onPress={() =>
                          onChangeFontSize(Math.min(30, currentFontSize + 2))
                        }
                      >
                        <Plus size={24} color="#000" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </Modal>
  )
}
