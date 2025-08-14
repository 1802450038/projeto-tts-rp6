import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_URL, api } from '~/services/api.axios'

type UseFetchProps<T> = {
  onSuccess?: (data: T) => Promise<void> | void
  params?: Record<string, unknown>
}

export const useFetch = <T = unknown>(
  url: string,
  options?: UseFetchProps<T>
) => {
  const isSuccessTriggered = useRef(false)
  const [isLoading, setLoading] = useState(false)
  const [isRefetching, setRefetching] = useState(false)
  const [isError, setError] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const params = useRef(options?.params)

  const refetch = async () => {
    setRefetching(true)
    setError(false)
    setLoading(false)

    await fetchData().finally(() => setRefetching(false))
  }

  useEffect(() => {
    if (isSuccessTriggered.current && (isLoading || !data)) return
    isSuccessTriggered.current = true
    options?.onSuccess?.(data as T)
  }, [isLoading, data, options?.onSuccess])

  const fetchData = useCallback(async () => {
    const controller = new AbortController()
    const { signal } = controller

    setLoading(true)
    setError(false)

    await api
      .get(`${DEFAULT_URL}${url}`, { signal, params: params.current })
      .then((result) => setData(result.data))
      .catch((error) => {
        if (error.name === 'CanceledError') return
        console.error(error)
        setError(true)
      })
      .finally(() => setLoading(false))

    return () => {
      controller.abort()
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    isLoading,
    isError,
    isRefetching,
    data,
    refetch
  }
}
