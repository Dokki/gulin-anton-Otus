import React, { useCallback, MouseEvent, FormEvent, useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

import { useContextStore, setMenu } from 'store'
import { modalNames } from 'components/helpers/modals'
import { menuNames } from 'components/helpers/menu'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import api from '../../api'

const SignIn = () => {
  const signInModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signIn),
  )
  const signUpModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signUp),
  )
  const [errors, setErrors] = useState<string[]>([])
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      const data = new FormData(event.currentTarget)

      setErrors([])
      event.preventDefault()

      const { ok, message } = await api.login(data)

      if (ok) {
        setMenu(menuNames.create)
        signInModal?.close()
      } else if (message)
        setErrors(Array.isArray(message) ? message : [message])
    },
    [],
  )

  const swapCredentialModals = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    signInModal?.close()
    signUpModal?.open()
  }

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
          <Link href="#" variant="body2" onClick={swapCredentialModals}>
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignIn
