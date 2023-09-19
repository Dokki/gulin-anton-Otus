import axios, { AxiosRequestConfig, HttpStatusCode, AxiosResponse } from 'axios'
import qs from 'qs'
import { useAuthStore, useGlobalLoader, useContentLoader } from '../store'
import showToast from './toast'
import { navigate } from '../App'

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
  baseURL: `${baseURL}api/`,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
  },
})

instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

instance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => {
    const { token } = response.headers

    if (token) useAuthStore.setState({ token })

    return response
  },
  (err) => {
    const {
      response: { status = 0, data } = {},
      config: { url, params },
      code,
      message,
    } = err as AxiosError<TErrorResponse>

    if (status === HttpStatusCode.Unauthorized) {
      showToast.warning('Нужно авторизоваться.')
      useAuthStore.getState().clear()

      navigate(`/sign-in?path=${encodeURIComponent(url as string)}`, {
        replace: true,
      })
    } else if (status >= HttpStatusCode.NotFound) {
      showToast.error('Такой страницы не существует')

      if (params && params.loader) navigate('/not-found')
    } else if (status >= HttpStatusCode.Forbidden) {
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
    } = await instance.post('login', data)

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
    } = await instance.post('registration', data)

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
    await instance.post('logout')

    useAuthStore.getState().clear()

    navigate('/', { replace: true })
  } catch (err) {
    return handleError(err)
  } finally {
    setGlobalLoader(false)
  }
}

const loader = async (url: string, config: AxiosRequestConfig) => {
  setLoader()

  try {
    const { data } = await instance.get(url, {
      ...config,
      params: { ...config.params, loader: true },
    })

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const addUpdateCourse = async (formData: FormData, id = '') => {
  setLoader()

  const url = id ? `/course/edit/${id}` : '/course/add'

  try {
    const { data } = await instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const deleteCourse = async (id: string) => {
  setLoader()

  try {
    const { data } = await instance.post(`delete-course/${id}`)

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const addComment = async (courseId: string, text: string) => {
  setLoader()

  try {
    const { data } = await instance.post('add-comment', { courseId, text })

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const deleteComment = async (id: string) => {
  setLoader()

  try {
    const { data } = await instance.post(`delete-comment/${id}`)

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const getUsers = async (except?: string[]) => {
  setLoader()

  try {
    const { data } = await instance.get('users', { params: { except } })

    return data
  } catch (err) {
    return handleError(err)
  } finally {
    setLoader(false)
  }
}

const api = {
  login,
  logout,
  loader,
  getUsers,
  addComment,
  deleteCourse,
  registration,
  deleteComment,
  addUpdateCourse,
}

export default api
