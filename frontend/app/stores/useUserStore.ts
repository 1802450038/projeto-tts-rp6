import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  _id: string,
  email: string 
}

type UseMeProps = {
  user: User | null
  setUser: (user: { _id: string, email: string }) => void
}

export const useUserStore = create<UseMeProps>()(
  persist<UseMeProps>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user'
    }
  )
)

export const UserStore = {
  user: null,
  setUser: (user: User | null) => useUserStore.setState({ user })
}
