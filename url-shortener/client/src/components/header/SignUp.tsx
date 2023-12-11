import React, { FormEvent, MouseEvent, useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { modalNames } from 'components/helpers/modals'
import { menuNames } from 'components/helpers/menu'
import { useContextStore, setMenu } from 'store'
import api from '../../api'

const SignUp = () => {
  const signInModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signIn),
  )
  const signUpModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signUp),
  )
  const [errors, setErrors] = useState<string[]>([])
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget)

    setErrors([])
    event.preventDefault()

    const { ok, message } = await api.registration(data)

    if (ok) {
      setMenu(menuNames.create)
      signUpModal?.close()
    } else if (message)
      setErrors(Array.isArray(message) ? [...message] : [message])
  }

  const swapCredentialModals = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    signUpModal?.close()
    signInModal?.open()
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}
      onSubmit={handleSubmit}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="Имя"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Фамилия"
            name="lastName"
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email адрес"
            name="email"
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="repeatPassword"
            label="Повторите пароль"
            type="password"
            id="repeatPassword"
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox value="1" name="extra" color="primary" />}
            label="Я хочу получать рекламу, маркетинговые акции и обновления по электронной почте."
          />
        </Grid>
      </Grid>
      {errors.length > 0 &&
        errors.map((error) => (
          <Box key={error} sx={{ color: 'red' }}>
            {error}
          </Box>
        ))}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
        Создать
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="#" variant="body2" onClick={swapCredentialModals}>
            Уже есть аккаунт? Войти
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignUp
