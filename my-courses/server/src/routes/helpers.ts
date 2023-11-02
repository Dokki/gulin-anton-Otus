import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import {
  tokenSecret,
  algorithm,
  expiresIn,
  expiresInRemember,
} from '../config/index.js'
import { findUserBy } from '../db/index.js'

export const send = {
  badRequest: (res: Response, message = 'Переданные данные не валидны') =>
    res.status(400).send({
      error: {
        status: 'Bad request',
        message,
      },
    }),
  unauthorized: (res: Response, message = 'Нужна авторизация') =>
    res.status(401).send({
      error: {
        status: 'Unauthorized',
        message,
      },
    }),
  notFound: (res: Response, message = 'Не найдено') =>
    res.status(404).send({
      error: {
        status: 'Not found',
        message,
      },
    }),
  forbidden: (res: Response, message = 'Запрещено') =>
    res.status(403).send({
      error: {
        status: 'Forbidden',
        message,
      },
    }),
  conflict: (res: Response, message = 'Конфликт данных') =>
    res.status(409).send({
      error: {
        status: 'Conflict',
        message,
      },
    }),
}

type TGetToken = {
  id: string
  remember?: boolean
}

export const getToken = ({ id, remember }: TGetToken) => {
  const payload: TGetToken = { id }

  if (remember) payload.remember = Boolean(remember)

  return jwt.sign(payload, tokenSecret, {
    algorithm,
    expiresIn: remember ? expiresInRemember : expiresIn,
  })
}
export const verifyToken = (
  token: string,
  done: (props: TGetToken | null) => void,
) =>
  jwt.verify(token, tokenSecret, async (err, payload) => {
    if (err) done(null)
    else if (payload) {
      const { id, remember } = payload as TGetToken
      const user = await findUserBy(id)

      if (!user) done(null)
      else done({ id, remember })
    }
  })

export const authChecker =
  (strict = true) =>
  (req: Request, res: Response, next: NextFunction) => {
    //need check X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block')

    const [, token] = req.headers?.authorization?.split(' ') || []

    if (token)
      verifyToken(token, (props) => {
        if (props === null) send.unauthorized(res, 'Нужно авторизоваться')
        else {
          const newToken = getToken(props)

          res.setHeader('token', newToken)
          res.locals.userId = props?.id || ''

          next()
        }
      })
    else if (!strict) next()
    else send.forbidden(res, 'Запрещено')
  }
