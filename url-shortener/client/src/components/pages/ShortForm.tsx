import React, {
  FC,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import LockIcon from '@mui/icons-material/Lock'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

import { ShortFormWrapper, SloganTop, SloganBottom, FormTitle } from '../style'
import { modalNames } from 'components/helpers/modals'
import { useAuthStore, useContextStore } from 'store'
import Content from '../elements/Content'
import api from 'api'

const ShortForm: FC = () => {
  const isAuth = useAuthStore((store) => !!store.token)
  const signInModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.signIn),
  )
  const signInModalData = signInModal?.data() as { submitForm: boolean }
  const shortModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.short),
  )
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState({ url: '', short: '' })
  const onChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({
      ...prev,
      [name]: event.target.value,
    }))
  const disabled = useMemo(() => {
    return !form.url
  }, [form])
  const handleSubmit = useCallback(async () => {
    if (disabled) return

    const data = new FormData()

    setErrors([])
    data.append('url', form.url)
    data.append('short', form.short)

    const { ok: resOk, message, short } = await api.createShort(data)

    if (resOk) {
      setForm((prev) => ({
        ...prev,
        url: '',
        short: '',
      }))
      shortModal?.open(short)
    } else if (message) setErrors(Array.isArray(message) ? message : [message])
  }, [disabled, form])

  useEffect(() => {
    if (signInModalData?.submitForm) {
      signInModal?.setData(undefined)
      handleSubmit()
    }
  }, [signInModalData, handleSubmit])

  return (
    <Box>
      <SloganTop variant="h3">
        Каждый{' '}
        <Box component="span" color="#2A5BD7">
          переход
        </Box>{' '}
        будет считаться!
      </SloganTop>
      <SloganBottom variant="h6">
        Создавайте короткие ссылки. Делитесь ими. <br />
        Отслеживайте, что работает, а что нет.{' '}
        <Box component="span" fontWeight="bold">
          Все внутри платформы Shortly Connections.
        </Box>
      </SloganBottom>
      <Content>
        <ShortFormWrapper>
          <FormTitle variant="h5" mb={1}>
            Укоротить длинную ссылку
          </FormTitle>
          <FormTitle variant="h6">Вставьте длинный URL</FormTitle>
          <TextField
            id="url"
            name="url"
            value={form.url}
            placeholder="Например: http://super-long-link.com/form-shorting?param1=value1&param2=value2&param3=value3"
            required
            fullWidth
            autoFocus
            onChange={onChange('url')}
          />
          <Box display="flex" mt={2}>
            <Box flexGrow={1}>
              <FormTitle variant="h6">Домен</FormTitle>
              <TextField
                id="domain"
                name="domain"
                value="shortly.ru"
                disabled
                fullWidth
                inputProps={{
                  sx: {
                    fontWeight: 'bold',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="На данный момент не доступно">
                      <LockIcon sx={{ color: '#1D1F21' }} />
                    </Tooltip>
                  ),
                }}
              />
            </Box>
            <Box p="48px 10px 0 10px" fontSize="1.5em">
              /
            </Box>
            <Box flexGrow={1}>
              <FormTitle variant="h6">
                Введите свой текст (опционально)
              </FormTitle>
              <TextField
                id="short"
                name="short"
                value={form.short}
                placeholder="Например: моя-любимая-ссылка"
                fullWidth
                onChange={onChange('short')}
              />
            </Box>
          </Box>
          {errors.length > 0 && (
            <Box pt="30px" textAlign="center">
              {errors.map((error) => (
                <Box key={error} sx={{ color: 'red' }}>
                  {error}
                </Box>
              ))}
            </Box>
          )}
          <Alert
            severity="info"
            icon={
              <AutoAwesomeIcon
                fontSize="inherit"
                sx={{ color: '#11BECF', marginTop: '4px' }}
              />
            }
            sx={{ marginTop: '30px', fontSize: '1.2em', color: '#007c8c' }}
          >
            Заканчивайте свои ссылки с вашим текстом, это сделает их уникальными
          </Alert>
          <Box textAlign="center">
            {isAuth && (
              <Button
                disabled={disabled}
                variant="contained"
                size="large"
                sx={{ marginTop: '30px' }}
                onClick={handleSubmit}
              >
                Получить ссылку
              </Button>
            )}
            {!isAuth && (
              <Button
                variant="contained"
                size="large"
                sx={{ marginTop: '30px' }}
                onClick={() => signInModal?.open({ submitForm: true })}
              >
                Войти и получить ссылку
              </Button>
            )}
          </Box>
          <FormTitle variant="h5" textAlign="center" mt="30px">
            Не нужно банковских карт,{' '}
            <Box component="span" color="#2A5BD7">
              все бесплатно
            </Box>
            , просто пользуйся!
          </FormTitle>
        </ShortFormWrapper>
      </Content>
    </Box>
  )
}

export default ShortForm
