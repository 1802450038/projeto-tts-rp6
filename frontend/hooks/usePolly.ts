import axios from 'axios'
import { useEffect } from 'react'
import { useFetch } from './useFetch'

export const usePolly = () => {
  const test = async () => {
    console.log('hello, world!')
  }

  return {
    test
  }
}
