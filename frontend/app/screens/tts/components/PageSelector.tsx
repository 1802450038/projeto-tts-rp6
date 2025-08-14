import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'

type PageSelectorProps = {
  defaultPageNumber: number
  documentId: string
  voiceId: VoiceId
  languageCode: LanguageCode
  totalPages?: number
}

export const PageSelector = ({
  defaultPageNumber = 0,
  totalPages = 5,
  documentId,
  voiceId,
  languageCode
}: PageSelectorProps) => {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [value, setValue] = useState({
    value: String(defaultPageNumber),
    label: `Página ${defaultPageNumber}`
  })

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12
  }

  return (
    <Select
      value={{
        label: `Página ${Number(value?.value) + 1}`,
        value: value?.value
      }}
      onValueChange={(value) => {
        setValue({
          value: String(value?.value),
          label: `Página ${value}`
        })
        router.replace({
          pathname: '/screens/tts/text-to-speech.page',
          params: {
            documentId,
            voiceId,
            languageCode,
            currentPage: value?.value,
            currentParagraph: 0
          }
        })
      }}
    >
      <SelectTrigger className="w-[250px] border-0">
        <SelectValue
          className="text-foreground text-xl font-medium"
          placeholder="Página 0"
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[250px]">
        <SelectGroup>
          <SelectLabel>Páginas</SelectLabel>
          {Array.from({ length: totalPages }, (_, i) => (
            <SelectItem key={i} label={`Pág. ${i + 1}`} value={`${i}`}>
              Grapes
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
