import axios, { AxiosRequestConfig, HttpStatusCode, AxiosResponse } from 'axios'
import qs from 'qs'

import { useAuthStore, useGlobalLoader, useContentLoader } from 'store'
import showToast from './toast'

interface AxiosError<T> extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: AxiosResponse
  response: {
    data: T
    status: number
  }
  isAxiosError: boolean
  toJSON: () => object
}
type TErrorResponse = {
  error?: {
    status: string
    message: string
  }
  type: string
  errors: string[]
}

export const baseURL = 'http://localhost:4000/'

const getResult = (status: number, message: string | string[] = '') => ({
  status,
  ok: status >= HttpStatusCode.Ok && status <= HttpStatusCode.Accepted,
  message,
})
const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const { response: { status = 0, data } = {} } = err as AxiosError<
      TErrorResponse | string
    >

    if (typeof data === 'string') return getResult(status, data)
    if (data?.error?.message) return getResult(status, data?.error?.message)
    if (data?.errors?.length) return getResult(status, data.errors)

    getResult(0, 'Что то пошло не так...')
  }

  return getResult(0, 'Что то пошло не так...')
}
// eslint-disable-next-line no-console
const logError = (...args: unknown[]) => console.error(args)
const setGlobalLoader = (isShow = true) => {
  const { show, hide } = useGlobalLoader.getState()

  if (isShow) show()
  else hide()
}
const setLoader = (isShow = true) => {
  const { show, hide } = useContentLoader.getState()

  if (isShow) show()
  else hide()
}
const axiosOpts = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
}

const instance = axios.create({
  ...axiosOpts,
  baseURL,
})

const instanceApi = axios.create({
  ...axiosOpts,
  baseURL: `${baseURL}api/`,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  },
})

instanceApi.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

instanceApi.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error),
)

instanceApi.interceptors.response.use(
  (response) => {
    const { token } = response.headers

    if (token) useAuthStore.setState({ token })

    return response
  },
  (err) => {
    const {
      response: { status = 0, data } = {},
      config: { url },
      code,
      message,
    } = err as AxiosError<TErrorResponse>

    if (status === HttpStatusCode.Unauthorized) {
      showToast.warning('Нужно авторизоваться.')
      useAuthStore.getState().clear()
      // загрузить контекст без
      // Тут нужно открыть модалку авторизации
    } else if (status === HttpStatusCode.NotFound) {
      if (!url?.includes('login')) {
        showToast.error('Такой страницы не существует')
      }
    } else if (status === HttpStatusCode.Forbidden) {
      logError(status, code, message)
      showToast.error(data?.error?.message || 'Запрещено')
    } else if (status >= HttpStatusCode.InternalServerError) {
      logError(status, code, message)
      showToast.error('Что то пошло не так...')
    } else if (status === 0) {
      logError(status, code, message)
      showToast.error('Что то с интернетом...')
    }

    return Promise.reject(err)
  },
)

const login = async (data: FormData) => {
  setGlobalLoader()

  try {
    const {
      data: { id, token, firstName, lastName, remember },
      status,
    } = await instanceApi.post('login', data)

    useAuthStore.setState({ id, token, firstName, lastName, remember })

    return getResult(status)
  } catch (err) {
    return handleError(err)
  } finally {
    setGlobalLoader(false)
  }
}

const registration = async (data: FormData) => {
  setGlobalLoader()

  try {
    const {
      data: { id, token, firstName, lastName },
      status,
    } = await instanceApi.post('registration', data)

    useAuthStore.setState({ id, token, firstName, lastName })

    return getResult(status)
  } catch (err) {
    return handleError(err)
  } finally {
    setGlobalLoader(false)
  }
}

const logout = async () => {
  setGlobalLoader()

  try {
    await instanceApi.post('logout')

    useAuthStore.getState().clear()
  } catch (err) {
    return handleError(err)
  } finally {
    setGlobalLoader(false)
  }
}

const ping = async (url: string) => {
  setLoader()

  try {
    await instance.get(url)

    return true
  } catch (err) {
    return false
  } finally {
    setLoader(false)
  }
}

const createShort = async (formData: FormData) => {
  setLoader()

  try {
    const { data } = await instanceApi.post('/short/add', formData)

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const deleteShort = async (id: string, isOwn: number) => {
  setLoader()

  try {
    const { data } = await instanceApi.post(`short/delete/${isOwn}/${id}`)

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const getShorts = async (page: number) => {
  const params = {} as { page: number }

  if (page) params.page = page

  setLoader()

  try {
    const { data } = await instanceApi.get('shorts', { params })

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const api = {
  ping,
  login,
  logout,
  getShorts,
  createShort,
  deleteShort,
  registration,
}

export default api
