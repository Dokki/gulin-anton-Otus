import React, { FC } from 'react'
import { useRouteError } from 'react-router-dom'
import Box from '@mui/material/Box'

const LoadingError: FC = () => {
  const error = useRouteError()

  // eslint-disable-next-line no-console
  console.error(error)

  return <Box>Loading Error</Box>
}

export default LoadingError
