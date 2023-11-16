export type TUserRegistration = {
  firstName: string
  lastName: string
  email: string
  password: string
  extra: string
}

export type TUserRaw = {
  _id: string
  userId: number
  firstName: string
  lastName: string
  email: string
  password: string
  extra: string
}

export type TUser = Omit<TUserRaw, '_id'> & { id: string }

export type TShort = {
  id: string
  url: string
  date: number
  short: string
  isOwn?: number
  clicks: number
  ownerId: string
  shortId: string
  shortUrl: string
}

export type TShortWithoutShortUrl = Omit<TShort, 'shortUrl'>

export type TShortsData = {
  shorts: TShort[]
  total: number
  page: number
}

export type TShortBaseRaw = {
  _id: string
  url: string
  short: string
}

export type TShortBase = Omit<TShortBaseRaw, '_id'> & { id: string }

export type TShortUserBaseRaw = {
  _id: string
  date: number
  clicks: number
  ownerId: string
  shortId: string
}

export type TShortUserBase = Omit<TShortUserBaseRaw, '_id'> & { id: string }

export type TShortUserOwnBaseRaw = {
  _id: string
  url: string
  date: number
  short: string
  clicks: number
  ownerId: string
}

export type TShortUserOwnBase = Omit<TShortUserOwnBaseRaw, '_id'> & {
  id: string
}
