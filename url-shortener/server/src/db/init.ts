import client from './client.js'
import { userIdCounter } from './helpers.js'

const { mongoDB, dbName } = client

export const checkDbExist = async () => {
  const admin = await mongoDB.admin()
  const dbInfo = await admin.listDatabases()

  return dbInfo.databases.some((db) => db.name === dbName)
}

export const collectionNames = {
  users: 'users',
  shorts: 'shorts',
  counters: 'counters',
  userShorts: 'user-shorts',
  userOwnShorts: 'user-own-shorts',
}
const collectionNamesArr = Object.values(collectionNames)
const createCollections = async () => {
  const db = await mongoDB.getDb()

  await Promise.all(
    collectionNamesArr.map(async (name) => await db.createCollection(name)),
  )

  const users = db.collection(collectionNames.counters)

  await users.insertOne({
    _id: userIdCounter,
    count: 0,
  })
}

export const initDB = async () => {
  const dbExist = await checkDbExist()

  if (dbExist) return

  await createCollections()
}
