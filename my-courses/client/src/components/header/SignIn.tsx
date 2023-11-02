import React, { FormEvent, useState, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useAuthStore } from '../../store'
import api from '../../api'
import { goTo } from '../../App'

const SignIn = () => {
  const isAuth = useAuthStore((state) => !!state.token)
  const location = useLocation()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      const data = new FormData(event.currentTarget)

      event.preventDefault()

      const { ok, message } = await api.login(data)

      if (ok) {
        const params = new URLSearchParams(location.search)

        if (params.has('path')) {
          const path = decodeURIComponent(params.get('path') as string)

          navigate(path)
        } else navigate('/')
      } else if (message)
        setErrors(Array.isArray(message) ? message : [message])
    },
    [location.key],
  )

  useEffect(() => {
    if (isAuth) navigate('/')
  }, [isAuth])

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        maxWidth: '500px',
        margin: '0 auto',
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email адрес"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Пароль"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <FormControlLabel
        control={<Checkbox value="1" name="remember" color="primary" />}
        label="Запомнить меня"
      />
      {errors.length > 0 &&
        errors.map((error) => (
          <Box key={error} sx={{ color: 'red' }}>
            {error}
          </Box>
        ))}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
        войти
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Забыли пароль?
          </Link>
        </Grid>
        <Grid item>
          <Link href="#" variant="body2" onClick={goTo('/sign-up')}>
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignIn
