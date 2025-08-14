import { useLocalSearchParams, useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { AudioPlayButton } from './PlayButton'
import { languages } from './language-voices'

type LanguageDrawerProps = {
  isVisible: boolean
  onClose: () => void
  onSelectLanguage: (language: string) => void
  selectedLanguage: string
  documentId: string
}

type Params = {
  voiceId: string
}

export const LanguageDrawer: React.FC<LanguageDrawerProps> = ({
  isVisible,
  onClose,
  onSelectLanguage,
  selectedLanguage,
  documentId
}) => {
  const router = useRouter()
  const params = useLocalSearchParams<Params>()
  const selectedLang = languages.find(
    (lang) => lang.code === selectedLanguage.split('-')[0]
  )

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30">
        <View className="flex-1 mt-auto bg-white rounded-t-3xl max-h-[50%]">
          <View className="px-4 py-2 border-b border-gray-100">
            <View className="flex-row items-center">
              <Pressable onPress={onClose} className="p-2">
                <X size={24} color="#000" />
              </Pressable>
              <View className="flex-1 items-center">
                <Text className="text-xl font-medium">Linguagens</Text>
              </View>
              <View className="w-10" />
            </View>
          </View>

          <View className="flex-1">
            <View className="h-12 border-b border-gray-100">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                className="h-full"
              >
                {languages.map((lang) => (
                  <Pressable
                    key={lang.code}
                    onPress={() => onSelectLanguage(lang.code)}
                    className={`px-5 h-full justify-center items-center border-b-2 ${
                      selectedLanguage.startsWith(lang.code)
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    <Text
                      className={
                        selectedLanguage.startsWith(lang.code)
                          ? 'text-blue-500 text-base'
                          : 'text-gray-500 text-base'
                      }
                    >
                      {lang.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <ScrollView className="flex-1">
              {selectedLang?.voices.map((voice) => (
                <View
                  key={voice.id}
                  className="flex-row items-center p-4 border-b border-gray-100"
                >
                  <View className="relative">
                    <Image
                      source={{ uri: voice.imagePath }}
                      className="w-12 h-12 rounded-full bg-gray-200"
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Pressable
                      onPress={() =>
                        router.replace({
                          pathname: '/screens/tts/text-to-speech.page',
                          params: {
                            documentId,
                            voiceId: voice.voiceId,
                            languageCode: voice.languageCode,
                            currentPage: 0,
                            currentParagraph: 0
                          }
                        })
                      }
                    >
                      <View className="flex-row items-center">
                        <Text className="text-lg">{voice.voiceId}</Text>
                        <View className="ml-2 px-2 py-0.5 bg-green-100 rounded">
                          <Text className="text-green-700 text-sm">Grátis</Text>
                        </View>
                        {voice.voiceId === params?.voiceId && (
                          <View className="ml-2 px-2 py-0.5 bg-purple-100 rounded">
                            <Text className="text-purple-700 text-sm">
                              Selecionado
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-500">
                        {voice.country} • {voice.gender}
                      </Text>
                    </Pressable>
                  </View>
                  <AudioPlayButton audioPath={voice.audioPath} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  )
}
