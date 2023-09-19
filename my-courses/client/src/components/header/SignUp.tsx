import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import api from '../../api'
import { useAuthStore } from '../../store'
import { goTo } from '../../App'

const SignUp = () => {
  const isAuth = useAuthStore((state) => !!state.token)
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget)

    event.preventDefault()

    const { ok, message } = await api.registration(data)

    if (ok) navigate('/')
    else if (message) setErrors(Array.isArray(message) ? message : [message])
  }

  useEffect(() => {
    if (isAuth) navigate('/')
  }, [isAuth])

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
          <Link href="#" variant="body2" onClick={goTo('/sign-in')}>
            Уже есть аккаунт? Войти
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignUp
