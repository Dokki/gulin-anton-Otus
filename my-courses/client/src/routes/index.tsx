import React, { FC } from 'react'
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  useLocation,
} from 'react-router-dom'
import { Params } from '@remix-run/router/utils'
import api from '../api'
import { mapUrlSearch } from '../api/helpers'
import { useAuthStore } from '../store'
import Index from '../components/pages/Index'
import Admin from '../components/pages/Admin'
import HowTo from '../components/pages/HowTo'
import SignIn from '../components/header/SignIn'
import SignUp from '../components/header/SignUp'
import Course from '../components/courses/Course'
import Courses from '../components/courses/Courses'
import NotFound from '../components/pages/NotFound'
import AddUpdateCourse from '../components/courses/AddUpdateCourse'
import LoadingError from '../components/elements/LoadingError'

type TSection = {
  title: string
  path: string
  auth: null | boolean
  index?: boolean
  menu?: boolean
  urlToPath?: (url: string, params: Params) => { url: string; params: Params }
  props?: Record<string, string | boolean | number>
  component: FC
  children?: TSection[]
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore(({ token }) => !!token)
  const location = useLocation()

  if (!isAuth) {
    const { pathname, search } = location
    const params = new URLSearchParams(search)
    const path = params.get('path')
    const loginUrl = 'sign-in'
    let url = `/${loginUrl}`

    if (path && !path.includes(loginUrl)) url += `?path=${path}`
    else if (pathname && !pathname.includes(loginUrl))
      url += `?path=${encodeURIComponent(pathname + search)}`

    return <Navigate to={url} replace />
  }

  return children
}

export const sections: TSection[] = [
  {
    title:
      'Онлайн‑курсы для профессионалов, дистанционное обучение современным профессиям',
    path: '/',
    index: true,
    auth: null,
    menu: true,
    component: Index,
  },
  {
    title: 'Курсы',
    path: '/courses',
    auth: null,
    menu: true,
    component: Courses,
  },
  {
    title: 'Мои курсы',
    path: '/courses/my',
    auth: true,
    menu: true,
    component: Courses,
    props: { isMy: true },
  },
  {
    title: 'Курс',
    path: '/course/:id',
    auth: false,
    component: Course,
    urlToPath: (url, { id }) => ({ url: `/course/${id}`, params: {} }),
  },
  {
    title: 'Редактировать курс',
    path: '/course/edit/:id',
    auth: true,
    component: AddUpdateCourse,
    urlToPath: (url, { id }) => ({ url: `/course/edit/${id}`, params: {} }),
  },
  {
    title: 'Добавить курс',
    path: '/course/add',
    auth: true,
    menu: true,
    component: AddUpdateCourse,
  },
  {
    title: 'Администрирование',
    path: '/admin',
    auth: true,
    menu: true,
    component: Admin,
  },
  {
    title: 'Хотите создать курс?',
    path: '/how-to',
    auth: false,
    menu: true,
    component: HowTo,
  },
]

export const routes = [
  { title: 'Войти', path: '/sign-in', element: <SignIn /> },
  { title: 'Зарегистрироваться', path: '/sign-up', element: <SignUp /> },
  { title: 'Нет такой страницы', path: '*', element: <NotFound /> },
]

const genRouter = (sectionsLocal: TSection[]): RouteObject[] =>
  sectionsLocal.map((section) => {
    const Section = section.component
    const route: RouteObject = {
      ...{ title: section.title },
      element: section.auth ? (
        <ProtectedRoute>
          <Section {...(section.props || {})} />
        </ProtectedRoute>
      ) : (
        <Section {...(section.props || {})} />
      ),
      path: section.path,
      loader: async ({ request, params }) => {
        document.title = `${section.title} - Otus courses`

        if (section.index) return true

        const loader = api.loader
        const url = new URL(request.url)
        const urlToPath = section.urlToPath
          ? section.urlToPath(section.path, params)
          : { url: section.path, params }

        return loader(urlToPath.url, {
          signal: request.signal,
          params: mapUrlSearch(url),
        })
      },
      errorElement: <LoadingError />,
    }

    if (section?.children?.length) route.children = genRouter(section.children)

    return route
  })

export const router = createBrowserRouter([
  ...genRouter(sections),
  ...routes.map((route) => ({
    ...route,
    loader: () => {
      document.title = `${route.title} - Otus courses`

      return true
    },
  })),
])
