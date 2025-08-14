import * as FileSystem from 'expo-file-system'
import { useCallback, useEffect, useState } from 'react'
import { api } from '~/services/api.axios'

type UseDownloadFileProps = {
  url: string
  filePath: string
  autoFetch?: boolean
}

type ReturnHandleAsync<T> = [T | null, unknown] | [null, string]

export const useDownloadFile = ({
  url,
  filePath,
  autoFetch = true
}: UseDownloadFileProps) => {
  const [fileUri, setFileUri] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)

  const handleAsync = useCallback(
    async <T>(
      promise: Promise<T>,
      error = ''
    ): Promise<ReturnHandleAsync<T>> => {
      try {
        const data = await promise
        setError(null)
        return [data, null]
      } catch {
        setError(error ?? 'Error')
        return [null, error ?? 'Error']
      }
    },
    []
  )

  const downloadFile = useCallback(async () => {
    const fileName = `audio-${Date.now()}.mp3`

    const [response, error] = await handleAsync(
      api.get(url, {
        params: {
          filePath
        },
        responseType: 'blob'
      }),
      'Erro ao baixar o arquivo'
    )

    return { response: response, fileName }
  }, [url, handleAsync, filePath])

  const processFile = useCallback(
    async (fileName: string) => {
      const fileUri = FileSystem.documentDirectory + fileName
      const fileReader = new FileReader()

      fileReader.onload = async () => {
        if (!fileReader.result) {
          console.error('Erro ao ler o arquivo')
          return
        }
        const base64 = fileReader.result as string
        const result = base64.split(',')[1]

        const [_, error] = await handleAsync(
          FileSystem.writeAsStringAsync(fileUri, result, {
            encoding: FileSystem.EncodingType.Base64
          }),
          'Erro ao salvar o arquivo'
        )

        if (!error) {
          setFileUri(fileUri)
        }
      }

      return { fileUri, fileReader }
    },
    [handleAsync]
  )

  const processAndDownloadFile = useCallback(async () => {
    setLoading(true)
    try {
      const { response, fileName } = await downloadFile()
      const { fileUri, fileReader } = await processFile(fileName)
      fileReader.readAsDataURL(response?.data)
      setFileUri(fileUri)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [downloadFile, processFile])

  useEffect(() => {
    if (autoFetch && url && filePath) {
      processAndDownloadFile()
    }

    return () => {
      setError(null)
      setLoading(false)
      setFileUri(null)
    }
  }, [processAndDownloadFile, url, filePath, autoFetch])

  return {
    downloadFile,
    processFile,
    fileUri,
    filePath,
    error,
    isLoading,
    processAndDownloadFile
  }
}
