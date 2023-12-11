import React, { useCallback, useEffect } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import { useAuthStore, useContextStore, setMenu, setContext } from 'store'
import { menuList } from 'components/helpers/menu'
import { modalNames } from 'components/helpers/modals'
import { parseHash } from 'components/helpers/shared'
import Content from '../elements/Content'
import { shallow } from 'zustand/shallow'
import Logo from '../../assets/logo.png'
import api from 'api'

const Header = () => {
  const { isAuth, firstName } = useAuthStore(
    (store) => ({ isAuth: !!store.token, firstName: store.firstName }),
    shallow,
  )
  const currentMenu = useContextStore(({ menu }) => menu)
  const signInModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signIn),
  )
  const signUpModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signUp),
  )
  const handleLogout = async () => {
    await api.logout()
  }
  const onButtonClick = useCallback(
    (menu: string) => () => {
      if (menu !== currentMenu) setMenu(menu)
    },
    [currentMenu],
  )
  const isSelected = useCallback(
    (menu: string) => (currentMenu === menu ? 'contained' : 'text'),
    [currentMenu],
  )

  useEffect(() => {
    const listener = () => {
      const { menu, page } = parseHash(location.hash)

      setContext({ menu, page })
    }

    window.addEventListener('hashchange', listener)

    return () => window.removeEventListener('hashchange', listener)
  }, [])

  return (
    <Content>
      <Toolbar sx={{ mt: '5px', mb: 3 }}>
        <Button variant="text">
          <img src={Logo} alt="Logo" />
        </Button>
        <Box flexGrow={1} padding="10px 0 15px 20px" textAlign="center">
          {isAuth &&
            menuList.map(({ label, menu }) => (
              <Button
                key={menu}
                variant={isSelected(menu)}
                sx={{ padding: '6px 16px' }}
                onClick={onButtonClick(menu)}
              >
                {label}
              </Button>
            ))}
        </Box>
        {isAuth && (
          <Box ml="auto">
            <span>Привет, {firstName}!</span>
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: '5px' }}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        )}
        {!isAuth && (
          <Box ml="auto">
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: '5px' }}
              onClick={() => signInModal?.open()}
            >
              Войти
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => signUpModal?.open()}
            >
              Зарегистрироваться
            </Button>
          </Box>
        )}
      </Toolbar>
    </Content>
  )
}

export default Header
