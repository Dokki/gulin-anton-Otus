import { ErrorRequestHandler } from 'express'

const onError: ErrorRequestHandler = (err, req, res) => {
  // eslint-disable-next-line no-console
  console.log(err)

  if (err?.error?.isJoi) {
    // eslint-disable-next-line no-console
    console.log(err.error.details)

    res.status(400).json({
      type: err.type,
      errors: err.error.details.map(
        (error: { message: string }) => error.message,
      ),
    })
  } else {
    const status = err.status || 500
    const message = err.message || 'Something went wrong. Try again later'

    res.status(status).json({ message })
  }
}

export default onError
