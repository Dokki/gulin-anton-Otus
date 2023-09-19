import { ObjectId } from 'mongodb'
import { randomBytes, pbkdf2 } from 'node:crypto'
import { TUserRegistration, TCourse, TComment, TUser } from '../../../shared'
import clientDb from './client'

export const mongoDB = new clientDb.MongoDB()
const rename = (
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

let exceptionOccurred = false

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log('Caught exception: ', err)
  exceptionOccurred = true
  process.exit(1)
})

process.on('exit', async () => {
  // eslint-disable-next-line no-console
  if (exceptionOccurred) console.log('Exception occurred')
  // eslint-disable-next-line no-console
  else console.log('Kill signal received')

  await mongoDB.close()
})

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

export const checkDbExist = async () => {
  const admin = await mongoDB.admin()
  const dbInfo = await admin.listDatabases()

  return dbInfo.databases.some((db) => db.name === clientDb.dbName)
}

export const initDB = async () => {
  const dbExist = await checkDbExist()

  if (dbExist) return

  await createCollections()
}

const collectionNames = ['users', 'courses', 'comments']
const createCollections = async () => {
  const db = await mongoDB.getDb()

  return Promise.all(
    collectionNames.map(async (name) => {
      const collection = await db.createCollection(name)
      const json = (await import(`../data/${name}.js`)).default

      return collection.insertMany(json)
    }),
  )
}

export const getUser = async (email: string) => {
  const db = await mongoDB.getDb()
  const users = db.collection('users')
  const user = await users.findOne({ email })

  if (user) {
    const { _id, ...rest } = user

    return {
      id: _id.toString(),
      ...rest,
    }
  }

  return null
}

export const getUsers = async (except: string[] = []) => {
  const db = await mongoDB.getDb()
  const usersDB = db.collection<TUser>('users')
  const users = await usersDB.find().sort({ firstName: 1 }).toArray()

  return (
    users
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ _id, password, ...user }) => ({ ...user, id: _id.toString() }))
      .filter((user) => !except.includes(user.id))
  )
}

export const findUserBy = async (value: string, param = '_id') => {
  const db = await mongoDB.getDb()
  const users = db.collection('users')
  const valueSelf = param === '_id' ? new ObjectId(value) : value
  const user = await users.findOne({ [param]: valueSelf })

  if (user) {
    const { _id, ...rest } = user

    return {
      id: _id.toString(),
      ...rest,
    }
  }

  return null
}

export const createUser = async (data: TUserRegistration) => {
  const db = await mongoDB.getDb()
  const users = db.collection('users')
  const { password } = data

  return await users.insertOne({
    ...data,
    password: await encodePassword(password),
  })
}

export const createCourse = async ({
  title,
  introduction,
  description,
  images = [],
  access,
  userId,
}: TCourse) => {
  const db = await mongoDB.getDb()
  const coursesDB = db.collection('courses')

  return await coursesDB.insertOne({
    title,
    introduction,
    description,
    images: images.map((image) => ({
      name: image.name,
      uuidName: image.uuidName,
    })),
    access,
    date: Date.now(),
    owner: { $ref: 'users', $id: new ObjectId(userId) },
  })
}

export const getCourse = async (id: string, userId = ''): Promise<TCourse> => {
  const db = await mongoDB.getDb()
  const coursesDB = db.collection('courses')
  const courseId = new ObjectId(id)
  const [course] = await coursesDB
    .aggregate<TCourse>([
      {
        $match: {
          _id: courseId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.$id',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      ...rename([
        { key: '_id', toKey: 'id' },
        { key: 'owner._id', toKey: 'owner.id' },
      ]),
      { $project: { 'owner.password': 0, 'owner.extra': 0 } },
      {
        $lookup: {
          from: 'comments',
          let: { courseId: '$id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$courseId', '$courseId'] } } },
            {
              $lookup: {
                from: 'users',
                localField: 'owner.$id',
                foreignField: '_id',
                as: 'owner',
              },
            },
            { $unwind: '$owner' },
            ...rename([
              { key: '_id', toKey: 'id' },
              { key: 'owner._id', toKey: 'owner.id' },
            ]),
            {
              $project: { 'owner.password': 0, 'owner.extra': 0, courseId: 0 },
            },
          ],
          as: 'comments',
        },
      },
    ])
    .toArray()

  if (course && course.comments && course.comments.length)
    course.comments.forEach((comment) => {
      comment.owner.is = comment.owner.id.toString() === userId
    })

  return course
}

export const updateCourse = async (id: string, course: TCourse) => {
  const db = await mongoDB.getDb()
  const coursesDB = db.collection('courses')

  await coursesDB.replaceOne(
    { _id: new ObjectId(id) },
    {
      ...course,
      owner: { $ref: 'users', $id: new ObjectId(course?.owner?.id) },
    },
  )
}

export const deleteCourse = async (id: string) => {
  const db = await mongoDB.getDb()
  const coursesDB = db.collection('courses')

  await coursesDB.deleteOne({ _id: new ObjectId(id) })
}

const perPage = 5

export const getCourses = async (
  pageRaw: string,
  userId?: string,
): Promise<{ courses: TCourse[]; total: number; page?: number }> => {
  const db = await mongoDB.getDb()
  const coursesDB = db.collection('courses')
  const page = pageRaw ? parseInt(pageRaw, 10) : 1
  const match = [
    {
      $match: {
        'owner.$id': new ObjectId(userId),
      },
    },
  ]

  const [
    {
      courses,
      total: { count },
    },
  ] = await coursesDB
    .aggregate<{ courses: TCourse[]; total: { count: number } }>([
      ...(userId ? match : []),
      {
        $project: {
          _id: 1,
          title: 1,
          introduction: 1,
          date: 1,
          owner: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.$id',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      ...rename([
        { key: '_id', toKey: 'id' },
        { key: 'owner._id', toKey: 'owner.id' },
      ]),
      {
        $lookup: {
          from: 'comments',
          localField: 'id',
          foreignField: 'courseId',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentsCount: {
            $size: '$comments',
          },
        },
      },
      { $project: { 'owner.password': 0, 'owner.extra': 0, comments: 0 } },
      {
        $facet: {
          courses: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
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

  const result: { courses: TCourse[]; total: number; page?: number } = {
    courses,
    total: Math.ceil(count / perPage),
    page,
  }

  if (!page) delete result.page

  return result
}

export const getComment = async (id: string, userId: string) => {
  const db = await mongoDB.getDb()
  const commentsDB = db.collection('comments')
  const [comment] = await commentsDB
    .aggregate<TComment>([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner.$id',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      ...rename([
        { key: '_id', toKey: 'id' },
        { key: 'owner._id', toKey: 'owner.id' },
      ]),
      { $project: { 'owner.password': 0, 'owner.extra': 0 } },
    ])
    .toArray()

  if (comment) comment.owner.is = comment.owner.id.toString() === userId

  return comment
}

export const addComment = async ({
  courseId,
  userId,
  text,
}: {
  courseId: string
  userId: string
  text: string
}) => {
  const db = await mongoDB.getDb()
  const commentsDB = db.collection('comments')
  const { insertedId } = await commentsDB.insertOne({
    text,
    owner: { $ref: 'users', $id: new ObjectId(userId) },
    date: Date.now(),
    courseId: new ObjectId(courseId),
  })

  return await getComment(insertedId.toString(), userId)
}

export const deleteComment = async (id: string) => {
  const db = await mongoDB.getDb()
  const commentsDB = db.collection('comments')

  await commentsDB.deleteOne({ _id: new ObjectId(id) })
}
