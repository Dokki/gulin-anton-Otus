import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { useGlobalLoader } from 'store'

const Backward = styled(Box)`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  z-index: 9999;
  left: 0;
  top: 0;
`

const LoaderIcon = styled(CircularProgress)`
  margin: 0 auto;
  color: wheat;
`

const GlobalLoader = () => {
  const isShow = useGlobalLoader((state) => state.isShow)

  if (!isShow) return null

  return (
    <Backward>
      <LoaderIcon />
    </Backward>
  )
}

export default GlobalLoader
