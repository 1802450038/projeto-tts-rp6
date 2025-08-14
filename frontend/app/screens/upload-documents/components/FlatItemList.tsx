import { Link, useRouter } from 'expo-router'
import { CirclePlay, Trash } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { AlertDialog } from '~/components/AlertDialog'
import { Button } from '~/components/ui/button'
import { Card, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { cn } from '~/lib/utils'
import { DEFAULT_URL, api } from '~/services/api.axios'

export type Item = {
  _id: number
  name: string
  currentPage: number
  progress?: number
  languageCode: string
  voiceId: string
  currentParagraph?: number
}

type FlatItemListProps = {
  item: Item
}

export const FlatItemList = ({ item }: FlatItemListProps) => {
  const [isOpen, setOpen] = useState(false)
  const router = useRouter()

  const onRemove = useCallback(async () => {
    const data = await api.delete(`${DEFAULT_URL}/documents/${item._id}`)

    if (data.status === 200) {
      ToastAndroid.show('Excluído com sucesso', ToastAndroid.SHORT)
      router.replace('/')
      return
    }
    ToastAndroid.show('Falha ao excluir', ToastAndroid.SHORT)
  }, [item, router])

  const renderButton = useCallback(() => {
    return (
      <AlertDialog
        title="Você tem certeza?"
        description="Esta ação não pode ser desfeita e os itens deletados não poderão mais ser recuperados."
        isOpen={isOpen}
        onOpenChange={setOpen}
        onAction={onRemove}
      >
        <Button
          onPress={() => setOpen(true)}
          variant="destructive"
          className="!h-full rounded-2xl"
        >
          <View className="flex flex-col items-center justify-center gap-1">
            <Trash size={28} color={'white'} />
            <Text className="text-white text-sm">Excluir?</Text>
          </View>
        </Button>
      </AlertDialog>
    )
  }, [onRemove, isOpen])

  return (
    <>
      <Swipeable renderRightActions={renderButton} overshootLeft={false}>
        <TouchableOpacity activeOpacity={1}>
          <Card
            className={cn(
              'flex flex-row gap-4 items-center p-4',
              'justify-between rounded-2xl bg-[#535353]'
            )}
          >
            <Link
              href={{
                pathname: '/screens/tts/text-to-speech.page',
                params: {
                  documentId: item._id,
                  currentPage: item.currentPage,
                  voiceId: item.voiceId,
                  languageCode: item.languageCode,
                  currentParagraph: 0
                }
              }}
              style={{ flex: 1 }}
            >
              <View className="flex flex-col gap-2 flex-grow">
                <CardTitle className="text-[#29c97e] text-xl">
                  {item.name}
                </CardTitle>
                <View className="flex flex-col gap-1.5 ">
                  <Text className="text-white text-xs ">
                    Página {item.currentPage + 1}
                  </Text>
                  <Progress
                    value={item.progress}
                    className="w-full h-3 p-0.5"
                    indicatorClassName="bg-gray-500 rounded-full"
                  />
                </View>
              </View>
            </Link>

            {}
            <Link
              href={{
                pathname: '/screens/tts/text-to-speech.page',
                params: {
                  documentId: item._id,
                  currentPage: item.currentPage,
                  voiceId: item.voiceId,
                  languageCode: item.languageCode,
                  currentParagraph: 0
                }
              }}
            >
              <CirclePlay size={50} color="#29c97e" />
            </Link>
          </Card>
        </TouchableOpacity>
      </Swipeable>
    </>
  )
}
