import { ObjectId } from 'mongodb'
import client from './client.js'
import { collectionNames } from './init.js'
import { rename, replaceId } from './helpers.js'
import {
  TShortWithoutShortUrl,
  TShortUserOwnBaseRaw,
  TShortUserOwnBase,
  TShortUserBaseRaw,
  TShortUserBase,
  TShortBaseRaw,
  TShortBase,
} from '../../../shared/index.js'

const { mongoDB } = client

const createBaseShort = async ({
  url,
  short,
}: Omit<TShortBase, 'id'>): Promise<TShortBase> => {
  const db = await mongoDB.getDb()
  const shortsDB = db.collection(collectionNames.shorts)
  const document = {
    url,
    short,
  }
  const { insertedId } = await shortsDB.insertOne({ ...document })

  return {
    ...document,
    id: insertedId.toString(),
  }
}
const getBaseShort = async ({
  url,
  shortId,
}: {
  url?: string
  shortId?: string
}): Promise<TShortBase | null> => {
  const db = await mongoDB.getDb()
  const shortsDB = db.collection(collectionNames.shorts)
  const param = shortId ? 'short' : 'url'
  const value = shortId ? shortId : url
  const short = await shortsDB.findOne<TShortBaseRaw>({ [param]: value })

  if (short) {
    return replaceId<TShortBaseRaw, TShortBase>(short)
  }

  return null
}

const createUserShort = async ({
  ownerId,
  shortId,
}: {
  ownerId: string
  shortId: string
}): Promise<TShortUserBase> => {
  const db = await mongoDB.getDb()
  const shortsDB = db.collection(collectionNames.userShorts)
  const document = {
    date: Date.now(),
    ownerId,
    clicks: 0,
    shortId,
  }
  const { insertedId } = await shortsDB.insertOne({ ...document })

  return {
    ...document,
    id: insertedId.toString(),
  }
}
export const getUserShort = async ({
  id,
  ownerId,
  shortId,
}: {
  id?: string
  ownerId?: string
  shortId?: string
}): Promise<TShortUserBase | null> => {
  const db = await mongoDB.getDb()
  const userShortsDB = db.collection(collectionNames.userShorts)
  let userShort

  if (id) {
    userShort = await userShortsDB.findOne<TShortUserBaseRaw>({
      _id: new ObjectId(id),
    })
  } else {
    userShort = await userShortsDB.findOne<TShortUserBaseRaw>({
      shortId,
      ownerId,
    })
  }

  if (userShort) {
    return replaceId<TShortUserBaseRaw, TShortUserBase>(userShort)
  }

  return null
}

export const createUserOwnShort = async ({
  url,
  short,
  ownerId,
}: {
  url: string
  short: string
  ownerId: string
}): Promise<TShortUserOwnBase> => {
  const db = await mongoDB.getDb()
  const shortsDB = db.collection(collectionNames.userOwnShorts)
  const document = {
    url,
    date: Date.now(),
    short,
    clicks: 0,
    ownerId,
  }
  const { insertedId } = await shortsDB.insertOne({ ...document })

  return {
    ...document,
    id: insertedId.toString(),
  }
}
export const getUserOwnShort = async ({
  id,
  ownerId,
  short,
}: {
  id?: string
  short?: string
  ownerId?: string
}): Promise<TShortUserOwnBase | null> => {
  const db = await mongoDB.getDb()
  const userShortsDB = db.collection(collectionNames.userOwnShorts)
  let userShort

  if (id) {
    userShort = await userShortsDB.findOne<TShortUserOwnBaseRaw>({
      _id: new ObjectId(id),
    })
  } else {
    userShort = await userShortsDB.findOne<TShortUserOwnBaseRaw>({
      short,
      ownerId,
    })
  }

  if (userShort) {
    return replaceId<TShortUserOwnBaseRaw, TShortUserOwnBase>(userShort)
  }

  return null
}

export const createShort = async ({
  url,
  short: shortId,
  ownerId,
}: {
  url: string
  short: string
  ownerId: string
}): Promise<TShortWithoutShortUrl> => {
  let short = await getBaseShort({ url })

  if (!short) short = await createBaseShort({ url, short: shortId })

  let userShort = await getUserShort({ shortId, ownerId })

  if (!userShort)
    userShort = await createUserShort({ shortId: short.id, ownerId })

  return {
    ...short,
    ...userShort,
    shortId: short.id,
  }
}
export const getShort = async (
  url: string,
  ownerId: string,
): Promise<TShortWithoutShortUrl | null> => {
  const short = await getBaseShort({ url })

  if (!short) return null

  const userShort = await getUserShort({
    shortId: short.id,
    ownerId,
  })

  if (!userShort) return null

  return {
    ...short,
    ...userShort,
    shortId: short.id,
  }
}
const shortClick = async (id: string, isOwn = false) => {
  const db = await mongoDB.getDb()
  const users = db.collection(
    isOwn ? collectionNames.userOwnShorts : collectionNames.userShorts,
  )

  await users.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { clicks: 1 } },
    { upsert: true },
  )
}
export const getShortRedirect = async (
  shortId: string,
  ownerId: string,
): Promise<TShortWithoutShortUrl | null> => {
  const ownShort = await getUserOwnShort({ short: shortId, ownerId })

  if (ownShort) {
    await shortClick(ownShort.id, true)

    return {
      ...ownShort,
      shortId: '',
    }
  }

  const short = await getBaseShort({ shortId })

  if (!short) return null

  const userShort = await getUserShort({
    shortId: short.id,
    ownerId,
  })

  if (!userShort) return null

  await shortClick(userShort.id)

  return {
    ...short,
    ...userShort,
    shortId: short.id,
  }
}

export const deleteShort = async ({
  id,
  isOwn,
  shortId,
}: {
  id: string
  isOwn: boolean
  shortId: string
}) => {
  const db = await mongoDB.getDb()
  const userShortsDB = db.collection(
    isOwn ? collectionNames.userOwnShorts : collectionNames.userShorts,
  )

  await userShortsDB.deleteOne({ _id: new ObjectId(id) })

  if (shortId) {
    const otherShort = await userShortsDB.findOne<TShortUserBaseRaw>({
      shortId,
    })

    if (!otherShort) {
      const shortsDB = db.collection(collectionNames.shorts)

      await shortsDB.deleteOne({ _id: new ObjectId(shortId) })
    }
  }
}

const perPage = 5

export const getShorts = async (
  pageRaw: string,
  ownerId: string,
): Promise<{
  shorts: TShortWithoutShortUrl[]
  total: number
  page?: number
}> => {
  const db = await mongoDB.getDb()
  const shortsUserDB = db.collection(collectionNames.userShorts)
  const page = pageRaw ? parseInt(pageRaw, 10) : 1
  const [{ shorts = [], total: { count = 0 } = {} } = {}] = await shortsUserDB
    .aggregate<{ shorts: TShortWithoutShortUrl[]; total: { count: number } }>([
      {
        $match: {
          ownerId,
        },
      },
      {
        $project: {
          date: 1,
          clicks: 1,
          ownerId: 1,
          shortId: {
            $toObjectId: '$shortId',
          },
        },
      },
      {
        $lookup: {
          from: collectionNames.shorts,
          localField: 'shortId',
          foreignField: '_id',
          as: 'short',
        },
      },
      { $unwind: '$short' },
      {
        $addFields: {
          url: '$short.url',
          short: '$short.short',
        },
      },
      {
        $unionWith: {
          coll: collectionNames.userOwnShorts,
          pipeline: [{ $addFields: { isOwn: 1 } }],
        },
      },
      { $sort: { date: 1 } },
      ...rename([{ key: '_id', toKey: 'id' }]),
      {
        $facet: {
          shorts: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
          total: [
            {
              $count: 'count',
            },
          ],
        },
      },
      { $unwind: '$total' },
    ])
    .toArray()

  const result: {
    shorts: TShortWithoutShortUrl[]
    total: number
    page?: number
  } = {
    shorts,
    total: Math.ceil(count / perPage),
    page,
  }

  if (!page) delete result.page

  return result
}
