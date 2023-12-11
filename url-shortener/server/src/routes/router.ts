import { Router } from 'express'
import { authChecker } from './helpers.js'
import { findUserBy } from '../db/users.js'
import { getShortRedirect } from '../db/shorts.js'

export const router = Router()

router.get('/', authChecker(false), async (req, res) => {
  res.sendStatus(200)
})

router.get('/:userId/:shortId', async (req, res, next) => {
  const { params } = req

  const userId = parseInt(params.userId)
  const { shortId } = params

  if (isNaN(userId) || !shortId) {
    return next()
  }

  const user = await findUserBy(userId, 'userId')

  if (!user) {
    return next()
  }

  const short = await getShortRedirect(shortId, user.id)

  if (!short) {
    return next()
  }

  res.redirect(short.url)
})
