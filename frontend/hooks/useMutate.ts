import type { AxiosRequestConfig } from 'axios'
import { useState } from 'react'
import { DEFAULT_URL, api } from '~/services/api.axios'

type UseMutateProps<T> = {
  url: string
  method?: 'post' | 'put' | 'patch' | 'delete'
  options?: AxiosRequestConfig
}

export const useMutate = <T>({
  url,
  method = 'post',
  options
}: UseMutateProps<T>) => {
  const [isPending, setPending] = useState(false)
  const normalizedUrl = `${DEFAULT_URL}${url}`

  const mutateAsync = async (data: T, overrideOptions?: AxiosRequestConfig) => {
    setPending(true)

    return await api[method]?.(normalizedUrl, data, overrideOptions ?? options)
      .then((res) => res.data)
      .finally(() => setPending(false))
  }

  return {
    isPending,
    mutateAsync
  }
}
