import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { parseHash } from 'components/helpers/shared'

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

type TContextModal = {
  name: string
  open: (data?: unknown) => void
  data: () => unknown
  close: () => void
  setData: (data?: unknown) => void
  isOpened: () => void
}
interface IContext {
  menu: string
  page: number
  modals: TContextModal[]
}

const parsed = parseHash(location.hash)

export const useContextStore = create<IContext>()(
  devtools((set) => ({
    menu: parsed.menu,
    page: parsed.page,
    modals: [],
  })),
)

export const setContext = (state: Partial<IContext>) =>
  useContextStore.setState(state)

export const setMenu = (menu: string) => {
  const { pathname, search, hash } = location

  if (!['', '/'].includes(pathname) || search)
    history.replaceState(null, '', '/')

  location.hash = hash ? hash : ''

  setContext({ menu })
  setPage(menu, 1)
}

export const setPage = (menu: string, page = 1) => {
  const pageLocal = page > 1 ? `:${page}` : ''

  location.hash = `${menu}${pageLocal}`

  setContext({ page })
}

export const removeModal = (name: string) =>
  useContextStore.setState((prev) => ({
    modals: prev.modals.filter((modal) => modal.name !== name),
  }))

export const setModal = (modal: TContextModal) =>
  useContextStore.setState((prev) => {
    const index = prev.modals.findIndex(({ name }) => name === modal.name)

    if (index < 0) {
      return {
        modals: [...prev.modals, modal],
      }
    }

    prev.modals.splice(index, 1, modal)

    return {
      modals: prev.modals,
    }
  })

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
