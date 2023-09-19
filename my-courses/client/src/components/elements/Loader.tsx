import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { useContentLoader } from '../../store'

const Backward = styled(Box)`
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
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

const Loader = () => {
  const isShow = useContentLoader((state) => state.isShow)

  if (!isShow) return null

  return (
    <Backward>
      <LoaderIcon />
    </Backward>
  )
}

export default Loader
