import { Router } from 'express'
import { nanoid } from 'nanoid'
import { TUser, TShortUserBase } from '../../../shared/index.js'
import { getUser, createUser, findUserBy } from '../db/users.js'
import { validatorMiddleware } from './schemas.js'
import { encodePassword } from '../db/helpers.js'
import {
  getShort,
  getShorts,
  deleteShort,
  createShort,
  getUserShort,
  getUserOwnShort,
  createUserOwnShort,
} from '../db/shorts.js'
import {
  send,
  getToken,
  validateUrl,
  authChecker,
  generateShortUrl,
} from './helpers.js'

export const apiRouter = Router()

apiRouter.post(
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

apiRouter.post(
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
      password,
      email,
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

apiRouter.post('/logout', authChecker(), (req, res) => {
  res.sendStatus(200)
})

apiRouter.get('/shorts', authChecker(), async (req, res) => {
  const {
    query: { page },
  } = req
  const {
    locals: { userId = '' },
  } = res
  const user = await findUserBy(userId)

  if (!user) {
    return send.notFound(res, 'Юзер не найден')
  }

  const shorts = await getShorts(page as string, userId)

  res.status(200).send({
    ...shorts,
    shorts: shorts.shorts.map((short) => ({
      ...short,
      shortUrl: generateShortUrl(user.userId.toString(), short.short),
    })),
  })
})

apiRouter.post(
  '/short/add',
  authChecker(),
  ...validatorMiddleware('shortAdd'),
  async (req, res) => {
    const {
      locals: { userId = '' },
    } = res
    const {
      body: { url, short: ownShort },
    } = req
    const validate = validateUrl(url)

    if (!validate.valid || !validate.url)
      return send.badRequest(res, 'URL не валидный')

    const user = await findUserBy(userId)

    if (!user) {
      return send.notFound(res, 'Юзер не найден')
    }

    let short = ownShort
      ? await getUserOwnShort({ short: ownShort, ownerId: userId })
      : await getShort(validate.url.href, userId)

    if (!short) {
      const shortId = ownShort || nanoid(7)
      const props = {
        url: validate.url.href,
        short: shortId,
        ownerId: userId,
      }

      short = ownShort
        ? await createUserOwnShort(props)
        : await createShort(props)
    }

    res.status(200).send({
      ok: true,
      short: {
        ...short,
        shortUrl: generateShortUrl(user.userId.toString(), short.short),
      },
    })
  },
)

apiRouter.post('/short/delete/:own/:id', authChecker(), async (req, res) => {
  const {
    params: { id, own },
  } = req
  const {
    locals: { userId = '' },
  } = res
  const isOwn = own === '1'

  if (!id) return send.badRequest(res, 'Нет такого ссылки')

  const short = isOwn
    ? await getUserOwnShort({ id })
    : await getUserShort({ id })

  if (!short) return send.badRequest(res, 'Нет такого ссылки')

  if (!short || short.ownerId !== userId)
    return send.forbidden(res, 'У вас нет прав на удаление')

  await deleteShort({
    id,
    isOwn,
    shortId: (short as TShortUserBase).shortId,
  })

  res.status(200).send({
    ok: true,
  })
})
