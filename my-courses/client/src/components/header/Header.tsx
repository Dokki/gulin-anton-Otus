import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import HomeIcon from '@mui/icons-material/Home'
import Typography from '@mui/material/Typography'
import Content from '../elements/Content'
import { useAuthStore } from '../../store'
import { shallow } from 'zustand/shallow'
import api from '../../api'
import { goTo, navigate } from '../../App'
import { sections } from '../../routes'
import { SimpleLink } from '../style'

const Header = () => {
  const { isAuth, firstName } = useAuthStore(
    (store) => ({ isAuth: !!store.token, firstName: store.firstName }),
    shallow,
  )
  const handleLogout = async () => {
    await api.logout()

    await navigate('/')
  }

  return (
    <Content>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Typography
          component={SimpleLink}
          variant="h5"
          align="center"
          noWrap
          sx={{ flex: 1, textDecoration: 'none' }}
          href="#"
          onClick={goTo('/')}
        >
          Otus courses
        </Typography>
        {isAuth && (
          <>
            <span>Привет, {firstName}!</span>
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: '5px' }}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </>
        )}
        {!isAuth && (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: '5px' }}
              onClick={goTo('/sign-in')}
            >
              Войти
            </Button>
            <Button variant="outlined" size="small" onClick={goTo('/sign-up')}>
              Зарегистрироваться
            </Button>
          </>
        )}
      </Toolbar>
      <Toolbar
        component="nav"
        sx={{
          justifyContent: 'left',
          overflowX: 'auto',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {sections
          .filter(
            (section) =>
              section.menu &&
              (section.auth === null || section.auth === isAuth),
          )
          .map((section) => (
            <SimpleLink
              key={section.path}
              href={section.path}
              sx={{ p: 1, flexShrink: 0 }}
              onClick={goTo(section.index ? '/' : section.path)}
            >
              {section.index && (
                <IconButton>
                  <HomeIcon color="primary" />
                </IconButton>
              )}
              {!section.index && section.title}
            </SimpleLink>
          ))}
      </Toolbar>
    </Content>
  )
}

export default Header
