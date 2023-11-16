import React from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { ToastContainer } from 'react-toastify'

import ShortModalWrapper from 'components/elements/ShortModalWrapper'
import GlobalLoader from 'components/elements/GlobalLoader'
import { modalNames } from 'components/helpers/modals'
import Loader from 'components/elements/Loader'
import Router from 'components/elements/Router'
import Footer from 'components/footer/Footer'
import Header from 'components/header/Header'
import SignIn from 'components/header/SignIn'
import SignUp from 'components/header/SignUp'
import Modal from 'components/elements/Modal'

import 'react-toastify/dist/ReactToastify.min.css'

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
        <Router />
        <Modal name={modalNames.signIn} title="Войти">
          <SignIn />
        </Modal>
        <Modal name={modalNames.signUp} title="Зарегистрироваться">
          <SignUp />
        </Modal>
        <Modal name={modalNames.short} title="Ваша укороченная ссылка">
          <ShortModalWrapper />
        </Modal>
      </Box>
      <Footer />
    </Holder>
  )
}

export default App
