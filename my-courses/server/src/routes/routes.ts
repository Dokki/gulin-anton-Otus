import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { unlink } from 'node:fs/promises'
import { UploadedFile } from 'express-fileupload'
import { imagesAccept, uploadPath } from '../config/index.js'
import {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getUser,
  createUser,
  addComment,
  getComment,
  deleteComment,
  getUsers,
  encodePassword,
} from '../db/index.js'
import { send, authChecker, getToken } from './helpers.js'
import { TImagesResult, TUser } from '../../../shared/index.js'
import { validatorMiddleware } from './schemas.js'

type TUploadImages = {
  isValid: boolean
  images?: TImagesResult[]
}

const getExtension = (name: string): string[] =>
  (name || '').split('.').slice(-1)
const uploadImages = (files: UploadedFile | UploadedFile[]) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<TUploadImages>(async (resolve) => {
    const images = Array.isArray(files) ? files : [files].filter(Boolean)
    const result: TUploadImages = { isValid: true, images: [] }

    if (images.length) {
      const isValid = images.every(({ name }) => {
        const [extension] = getExtension(name)

        return imagesAccept.includes(extension)
      })

      if (isValid) {
        const imgPromises = images.map(
          async (image): Promise<TImagesResult> => {
            const [extension] = getExtension(image.name)
            const resultLocal = {
              name: image.name,
              isError: false,
              uuidName: uuid() + '.' + extension,
            }

            try {
              await image.mv(uploadPath + resultLocal.uuidName)

              return resultLocal
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log(err)

              resultLocal.isError = true

              return resultLocal
            }
          },
        )

        result.images = await Promise.all(imgPromises)

        resolve(result)
      } else resolve({ isValid })
    } else resolve(result)
  })

export const router = Router()

router.post(
  '/login',
  authChecker(false),
  ...validatorMiddleware('login'),
  async (req, res) => {
    const {
      locals: { userId = '' },
    } = res

    if (userId)
      return send.conflict(res, 'Сначала нужно выйти из своей учетной записи')

    const { email, password, remember } = req.body
    const user = (await getUser(email)) as TUser

    if (!user) return send.notFound(res, 'Не верно введены данные')

    const [salt, iterations] = user.password.split(':')
    const encPassword = await encodePassword(
      password,
      salt,
      parseInt(iterations, 10),
    )

    if (encPassword !== user.password)
      return send.forbidden(res, 'Не верно введены данные')

    res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      token: getToken({ id: user.id, remember }),
    })
  },
)

router.post(
  '/registration',
  authChecker(false),
  ...validatorMiddleware('registration'),
  async (req, res) => {
    const {
      locals: { userId = '' },
    } = res

    if (userId)
      return send.conflict(res, 'Сначала нужно выйти из своей учетной записи')

    const { firstName, lastName, email, password, extra = false } = req.body

    const user = await getUser(email)

    if (user)
      return send.conflict(
        res,
        'Пользователь с таким Email уже зарегистрирован',
      )

    const { insertedId } = await createUser({
      firstName,
      lastName,
      email,
      password,
      extra,
    })
    const id = insertedId.toString()
    const token = getToken({ id })

    res.status(200).send({
      firstName,
      lastName,
      token,
      id,
    })
  },
)

router.get('/courses', authChecker(false), async (req, res) => {
  const {
    query: { page },
  } = req
  const courses = await getCourses(page as string)

  res.status(200).send(courses)
})

router.get('/how-to', authChecker(false), async (req, res) => {
  res.status(200)

  res.send({
    courses: [],
  })
})

router.post('/logout', authChecker(), (req, res) => {
  res.sendStatus(200)
})

router.get('/users', authChecker(), async (req, res) => {
  const {
    query: { except = [] },
  } = req
  const {
    locals: { userId = '' },
  } = res
  const users = await getUsers([userId, ...(except as string[])])

  res.status(200).send(users)
})

router.get('/courses/my', authChecker(), async (req, res) => {
  const {
    query: { page },
  } = req
  const {
    locals: { userId = '' },
  } = res
  const courses = await getCourses(page as string, userId)

  res.status(200).send(courses)
})

router.get('/course/add', authChecker(), async (req, res) => {
  // Только для проверки авторизации
  res.status(200).send({
    ok: true,
    accept: imagesAccept,
  })
})

router.post(
  '/course/add',
  authChecker(),
  ...validatorMiddleware('courseAddEdit'),
  async (req, res) => {
    const {
      locals: { userId = '' },
    } = res
    const {
      body: { title, introduction, description, access },
      files,
    } = req
    const { isValid, images = [] } = await uploadImages((files || {}).images)

    if (!isValid)
      return send.badRequest(
        res,
        `Поддерживаются файлы только с расширением: ${imagesAccept.join(' ,')}`,
      )

    const { insertedId } = await createCourse({
      title,
      introduction,
      description,
      images: images.filter((image) => !image.isError),
      userId,
      access: JSON.parse(access),
    })

    res.status(200).send({
      ok: true,
      id: insertedId.toString(),
      images: images
        .filter((image) => image.isError)
        .map((image) => image.name),
    })
  },
)

router.get('/course/:id', authChecker(false), async (req, res) => {
  const {
    params: { id },
  } = req
  const {
    locals: { userId = '' },
  } = res

  if (!id) return send.badRequest(res, 'Нет такого курса')

  const course = await getCourse(id, userId)

  if (!course) return send.notFound(res, 'Нет такого курса')

  if (!course.owner || !course.owner.id)
    return send.forbidden(res, 'Нет такого курса')

  res.status(200).send({
    ok: true,
    course,
    isOwner: userId === course.owner.id.toString(),
  })
})

router.get('/course/edit/:id', authChecker(), async (req, res) => {
  const {
    params: { id },
  } = req
  const {
    locals: { userId = '' },
  } = res

  if (!id) return send.badRequest(res, 'Нет такого курса')

  const course = await getCourse(id)

  if (!course) return send.notFound(res, 'Нет такого курса')

  if (!course.owner || !course.owner.id)
    return send.notFound(res, 'Нет такого курса')

  const isOwner = userId === course.owner.id.toString()

  if (!isOwner) return send.forbidden(res, 'У вас нет прав на редактирование')

  // Только для проверки авторизации
  res.status(200).send({
    ok: true,
    accept: imagesAccept,
    course,
  })
})

router.post(
  '/course/edit/:id',
  authChecker(),
  ...validatorMiddleware('courseAddEdit'),
  async (req, res) => {
    const {
      params: { id },
    } = req
    const {
      locals: { userId = '' },
    } = res

    if (!id) return send.badRequest(res, 'Нет такого курса')

    const {
      body: { title, introduction, description, access, deletedImages },
      files,
    } = req
    const { comments, ...course } = await getCourse(id)

    if (!course || !course.owner || course.owner.id.toString() !== userId)
      return send.forbidden(res, 'У вас нет прав на редактирование')

    const { isValid, images: newImages = [] } = await uploadImages(
      (files || {}).images,
    )

    if (!isValid)
      return send.badRequest(
        res,
        `Поддерживаются файлы только с расширением: ${imagesAccept.join(' ,')}`,
      )

    const dImages = JSON.parse(deletedImages)

    if (Array.isArray(dImages) && dImages.length)
      await Promise.all(
        dImages.map(async (image: TImagesResult) => {
          try {
            await unlink(uploadPath + image.uuidName)

            const index = course.images.findIndex(
              (img) => img.uuidName === image.uuidName,
            )

            if (index >= 0) course.images.splice(index, 1)
          } catch (e) {
            // swallow
          }
        }),
      )

    await updateCourse(id, {
      ...course,
      title,
      introduction,
      description,
      images: [
        ...course.images,
        ...newImages.filter((image) => !image.isError),
      ],
      access: JSON.parse(access),
    })

    res.status(200).send({
      ok: true,
      id,
      images: newImages
        .filter((image) => image.isError)
        .map((image) => image.name),
    })
  },
)

router.post('/delete-course/:id', authChecker(), async (req, res) => {
  const {
    params: { id },
  } = req
  const {
    locals: { userId = '' },
  } = res

  if (!id) return send.badRequest(res, 'Нет такого курса')

  const course = await getCourse(id)

  if (!course || !course.owner || course.owner.id.toString() !== userId)
    return send.forbidden(res, 'У вас нет прав на редактирование')

  if (Array.isArray(course.images) && course.images.length)
    await Promise.all(
      course.images.map(async (image: TImagesResult) => {
        try {
          await unlink(uploadPath + image.uuidName)
        } catch (e) {
          // swallow
        }
      }),
    )

  await deleteCourse(id)

  res.status(200).send({
    ok: true,
  })
})

router.post(
  '/add-comment',
  authChecker(),
  ...validatorMiddleware('commentAdd'),
  async (req, res) => {
    const {
      body: { courseId, text },
    } = req
    const {
      locals: { userId = '' },
    } = res

    if (!userId) return send.unauthorized(res)

    if (!(await getCourse(courseId)))
      return send.notFound(res, 'Такого курса не существует')

    const comment = await addComment({
      courseId,
      userId,
      text,
    })

    res.status(200).send({
      ok: true,
      comment,
    })
  },
)

router.post('/delete-comment/:id', authChecker(), async (req, res) => {
  const {
    params: { id },
  } = req
  const {
    locals: { userId = '' },
  } = res

  if (!id) return send.badRequest(res, 'Нет такого комментария')

  const comment = await getComment(id, userId)

  if (!comment || !comment.owner || !comment.owner.is)
    return send.forbidden(res, 'У вас нет прав на удаление')

  await deleteComment(id)

  res.status(200).send({
    ok: true,
  })
})

router.get('/admin', authChecker(), async (req, res) => {
  res.status(200)

  res.send({})
})
