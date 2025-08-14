import * as DocumentPicker from 'expo-document-picker'
import { useRouter } from 'expo-router'
import { LucideLogOut, Menu, Plus, Search } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { Loading } from '~/app/components/LoadingComponents'
import { PageLayout } from '~/app/components/PageLayout'
import { useUserStore } from '~/app/stores/useUserStore'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/useAuth'
import { cn } from '~/lib/utils'
import { api } from '~/services/api.axios'
import { FlatItemList, type Item } from '../components/FlatItemList'

type UploadDocumentsItemsProps = {
  data: Item[]
  isLoading: boolean
}

export const UploadDocuments = ({
  data,
  isLoading
}: UploadDocumentsItemsProps) => {
  const [search, setSearch] = useState('')
  const [isExpanded, setExpanded] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const user = useUserStore((state) => state.user)
  console.log('larunda', user)

  const onUploadHandler = async () => {
    setExpanded((prev) => !prev)

    if (!isExpanded) {
      return
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true
    })

    if (result.assets?.[0]?.uri) {
      const file = result.assets[0]
      const formData = new FormData()

      formData.append(
        'file',
        JSON.stringify({
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        })
      )

      const data = await api.post('/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.status === 200) {
        ToastAndroid.show('Arquivo enviado com sucesso', ToastAndroid.SHORT)
        router.replace('/')
        return
      }
      ToastAndroid.show('Falha ao enviar arquivo', ToastAndroid.SHORT)
    }
  }

  return (
    <PageLayout className="px-4 pt-10">
      <View className="flex flex-row justify-between">
        <View className="flex flex-col gap-4">
          <Text className="text-5xl text-muted-foreground font-bold">
            Bem vindo!
          </Text>
          <Text className="text-xl text-muted-foreground">
            {user?.email ? ` ${user.email}` : ''}
          </Text>
          <Text className="text-xl text-muted-foreground">
            Últimos documentos
          </Text>
        </View>
        <Pressable
          onPress={signOut}
          className="w-16 h-16 bg-green-50 justify-center items-center border-1 border-green-50 rounded-lg overflow-visible"
        >
          <LucideLogOut
            size={36}
            color="#0fa919"
            strokeWidth={2.5}
            absoluteStrokeWidth
          />
        </Pressable>
      </View>
      <View className="flex flex-row items-center rounded-2xl px-3 justify-between bg-[#535353]">
        <View className="flex flex-row gap-2 items-center p-1 max-h-full">
          <Input
            placeholder="Buscar..."
            value={search}
            onChangeText={setSearch}
            className="border-0 color-[#29c97e] bg-[#535353] max-w-full"
            startContent={<Menu size={24} color="#29c97e" />}
            endContent={<Search size={24} color="#29c97e" />}
          />
        </View>
      </View>
      <GestureHandlerRootView className="w-full h-full">
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item._id.toString()}
            contentContainerClassName="pb-28 gap-4"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <FlatItemList item={item} />}
          />
        )}
      </GestureHandlerRootView>
      <TouchableOpacity
        className={cn(
          'absolute bottom-11 right-6 bg-[#29c97e] rounded-full p-2',
          isExpanded && 'rounded-2xl bg-[#838383] origin-bottom bottom-10'
        )}
        onPress={onUploadHandler}
      >
        <View
          className={cn(
            'flex flex-row items-center gap-2.5',
            isExpanded && 'p-1.5'
          )}
        >
          {isExpanded && (
            <View>
              <Text className={cn('text-xl font-semibold text-white')}>
                Selecionar Arquivo
              </Text>
            </View>
          )}
          <View
            className={cn(
              'bg-transparent rounded-full p-1',
              isExpanded && 'bg-[#535353]'
            )}
          >
            <Plus
              size={38}
              color={isExpanded ? '#29c97e' : '#535353'}
              strokeWidth={3}
            />
          </View>
        </View>
      </TouchableOpacity>
    </PageLayout>
  )
}
