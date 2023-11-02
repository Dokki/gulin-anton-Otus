import React, { MouseEvent } from 'react'
import { RouterProvider } from 'react-router-dom'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
import { ToastContainer } from 'react-toastify'
import GlobalLoader from './components/elements/GlobalLoader'
import Loader from './components/elements/Loader'
import Header from './components/header/Header'
import Copyright from './components/footer/Copyright'
import { router } from './routes'

import 'react-toastify/dist/ReactToastify.min.css'

export const navigate = async (url: string, opts: { replace?: boolean } = {}) =>
  await router.navigate(url, { replace: false, ...opts })

export const goTo =
  (url: string) =>
  async (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault()
    await navigate(url)
  }

const Holder = styled(Box)`
  .MuiButton-root {
    line-height: 25px;
  }
`

const App = () => {
  return (
    <Holder>
      <ToastContainer />
      <GlobalLoader />
      <Header />
      <Box sx={{ my: 2, position: 'relative', minHeight: '200px' }}>
        <Loader />
        <RouterProvider router={router} fallbackElement={<Loader />} />
      </Box>
      <Copyright />
    </Holder>
  )
}

export default App
