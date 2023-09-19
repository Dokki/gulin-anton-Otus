export type TUserRegistration = {
  firstName: string
  lastName: string
  email: string
  password: string
  extra: string
}

type TImagesResult = {
  name: string
  uuidName: string
  isError?: boolean
}

type TImagesResultLoader = TImagesResult & {
  dataURL: string
  isUploaded: boolean
}

export type TUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  extra: string
}

export type TOwner = {
  id: string
  firstName: string
  lastName: string
  email: string
  is?: boolean
}

export type TComment = {
  id: string
  text: string
  owner: TOwner
  date: number
  courseId: string
}

export type TCourse = {
  id?: string
  title: string
  introduction: string
  description: string
  commentsCount?: number
  comments?: TComment[]
  images: TImagesResult[]
  access: Partial<TOwner>[]
  owner?: TOwner
  date?: number
  userId?: string
}

type TCourseData = {
  ok: boolean
  isOwner: boolean
  accept: string[]
  message: string[]
  course: TCourse
  owner: TOwner
}

type TCoursesData = {
  courses: TCourse[]
  total: number
  page: number
}
