import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { type AxiosError } from 'axios'

const setup = () => {
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL as string,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  /**
   * Intercept errors.
   */
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 500) {
        console.error(error.response.data)
      }
      return Promise.reject(error)
    }
  )

  /**
   * Intercept a request to add the token and the language
   * in the request header.
   */
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}

export const api = setup()
export const DEFAULT_URL = process.env.EXPO_PUBLIC_API_BASE_URL as string
