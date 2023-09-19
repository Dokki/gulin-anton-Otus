import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface IUseAuthStore {
  id: string
  firstName: string
  lastName: string
  remember: boolean
  token: string
  clear: () => void
}

export const useAuthStore = create<IUseAuthStore>()(
  devtools(
    persist(
      (set) => ({
        id: '',
        firstName: '',
        lastName: '',
        remember: false,
        token: '',
        clear: () =>
          set({
            id: '',
            firstName: '',
            lastName: '',
            remember: false,
            token: '',
          }),
      }),
      {
        name: 'auth-storage',
      },
    ),
  ),
)

interface IUseLoader {
  isShow: boolean
  show: () => void
  hide: () => void
}

export const useGlobalLoader = create<IUseLoader>()(
  devtools((set) => ({
    isShow: false,
    show: () => set({ isShow: true }),
    hide: () => set({ isShow: false }),
  })),
)

export const useContentLoader = create<IUseLoader>()(
  devtools((set) => ({
    isShow: false,
    show: () => set({ isShow: true }),
    hide: () => set({ isShow: false }),
  })),
)
