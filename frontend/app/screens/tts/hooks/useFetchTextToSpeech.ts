import { useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { ToastAndroid } from 'react-native'
import { useUserStore } from '~/app/stores/useUserStore'
import { useFetch } from '~/hooks/useFetch'
import { useDownloadFile } from './useFileDownloaded'
import type { SpeechMark } from './useTextToSpeech'

type Params = {
  documentId: string
  currentPage: string
  voiceId: string
  languageCode: string
  currentParagraph?: string
}

type AudioFiles = {
  pageNumber: number
  currentParagraph: number
  speechMarks: {
    sentences: SpeechMark[]
  }
}

type UseFetchResponse = {
  dto: {
    _id: string
    name: string
    currentPage: number
    languageCode: string
    voiceId: string
    totalPages: number
    audioFiles: AudioFiles[]
  }
}

export const useFetchTextToSpeech = () => {
  const params = useLocalSearchParams<Params>()
  const user = useUserStore((state) => state.user)
  const fetch = useFetch<UseFetchResponse>('/documents/single', {
    params: {
      ...params,
      documentId: params?.documentId,
      pageNumber: params?.currentPage,
      voiceId: params?.voiceId,
      languageCode: params?.languageCode
    }
  })
  const modelInfo = `${params?.voiceId}-${params?.languageCode}`

  const downloaded = useDownloadFile({
    url: '/documents/download-file',
    filePath: `./audios/${user?._id}/${params?.documentId}-${params?.currentPage}-${modelInfo}.mp3`
  })

  useEffect(() => {
    if (downloaded.error) {
      ToastAndroid.showWithGravity('Voz não sintetizada.', 10, 2000)
    }
  }, [downloaded.error])

  const speechMarks = useMemo(() => {
    if (
      !fetch.data?.dto ||
      !fetch.data?.dto?.audioFiles?.length ||
      !params?.currentPage
    ) {
      return []
    }
    const speechMarks = fetch.data?.dto?.audioFiles?.find(
      (file) => file.pageNumber === Number(params?.currentPage)
    )

    return speechMarks?.speechMarks?.sentences ?? []
  }, [fetch.data?.dto, params.currentPage])

  return {
    params,
    isLoading: fetch.isLoading || downloaded.isLoading,
    fileUri: downloaded.fileUri,
    error: downloaded.error,
    speechMarks
  }
}
