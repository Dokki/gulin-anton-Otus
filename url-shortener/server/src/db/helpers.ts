import { randomBytes, pbkdf2 } from 'node:crypto'
import { ObjectId } from 'mongodb'
import client from './client.js'

const { mongoDB } = client

export const userIdCounter = new ObjectId('65525b039a994bf0a6dbf3c5')
export const getNextSequence = async (_id: ObjectId = userIdCounter) => {
  const db = await mongoDB.getDb()
  const users = db.collection('counters')

  const document = await users.findOneAndUpdate(
    { _id },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after' },
  )

  return document.value?.count
}

export const rename = (
  key: string | { key: string; toKey: string }[] = '_id',
  toKey = 'id',
) =>
  Array.isArray(key)
    ? [
        {
          $set: key.reduce((acc, { key: keyKLocal, toKey: toKeyLocal }) => {
            acc[toKeyLocal] = `$${keyKLocal}`
            acc[keyKLocal] = '$$REMOVE'

            return acc
          }, {} as { [key: string]: string }),
        },
      ]
    : [
        {
          $set: {
            [toKey]: `$${key}`,
            [key]: '$$REMOVE',
          },
        },
      ]

export const replaceId = <
  Raw extends { _id: string },
  Result extends { id: string },
>(
  object: Raw,
) => {
  const { _id, ...rest } = object

  return {
    id: _id.toString(),
    ...rest,
  }
}

export const encodePassword = (
  password: string,
  salt = randomBytes(128).toString('base64'),
  iterations = Math.floor(Math.random() * (10000 - 1000) + 1000),
): Promise<string> =>
  new Promise((resolve) => {
    pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
      if (err) throw err

      resolve(`${salt}:${iterations}:${hash.toString('hex')}`)
    })
  })
