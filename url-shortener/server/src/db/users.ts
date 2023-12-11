import { ObjectId } from 'mongodb'
import { TUserRegistration, TUserRaw, TUser } from '../../../shared/index.js'
import { replaceId, encodePassword, getNextSequence } from './helpers.js'
import { collectionNames } from './init.js'
import client from './client.js'

const { mongoDB } = client

export const getUser = async (email: string) => {
  const db = await mongoDB.getDb()
  const users = db.collection(collectionNames.users)
  const user = await users.findOne<TUserRaw>({ email })

  if (user) return replaceId<TUserRaw, TUser>(user)

  return null
}

export const findUserBy = async (value: string | number, param = '_id') => {
  const db = await mongoDB.getDb()
  const users = db.collection(collectionNames.users)
  const valueSelf = param === '_id' ? new ObjectId(value) : value
  const user = await users.findOne<TUserRaw>({ [param]: valueSelf })

  if (user) return replaceId<TUserRaw, TUser>(user)

  return null
}

export const createUser = async (data: TUserRegistration) => {
  const db = await mongoDB.getDb()
  const users = db.collection(collectionNames.users)
  const { password } = data

  return await users.insertOne({
    ...data,
    password: await encodePassword(password),
    userId: await getNextSequence(),
  })
}
