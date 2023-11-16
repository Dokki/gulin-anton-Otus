import { ErrorRequestHandler } from 'express'

type TKeysConsole = keyof Console
type TConsole = Record<TKeysConsole, (...rest: unknown[]) => void>

const Logger = () =>
  Object.keys(console).reduce<TConsole>((acc, key) => {
    acc[key as TKeysConsole] = (...rest: unknown[]) =>
      (console as unknown as TConsole)[key as TKeysConsole](...rest)

    return acc
  }, {} as TConsole)

export const logger = Logger()

// next argument is need. Internal express logical is watching for arguments.length
export const onError: ErrorRequestHandler = (err, req, res, next) => {
  logger.log(err)

  if (err?.error?.isJoi) {
    logger.log(err.error.details)

    res.status(400).json({
      type: err.type,
      errors: err.error.details.map(
        (error: { message: string }) => error.message,
      ),
    })
  } else {
    const status = err?.status || 500
    const message = err?.message || 'Something went wrong. Try again later'

    res.status(status).json({ message })
  }
}
