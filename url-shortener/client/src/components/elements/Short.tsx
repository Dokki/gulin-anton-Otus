import React, { FC, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import { TShort } from '../../../../shared'
import { formatter } from 'api/helpers'
import useModal from 'hooks/useModal'
import showToast from 'api/toast'
import api from 'api/index'
import {
  ShortViewWrapper,
  ShortWrapper,
  CopiedText,
  copiedTime,
  FormTitle,
  ShortInfo,
} from '../style'

const Short: FC<{ short: TShort; isView?: boolean; onDelete?: () => void }> = ({
  short,
  isView = false,
  onDelete,
}) => {
  const { id, url, date, isOwn, clicks, shortUrl } = short
  const [copied, setCopied] = useState({ url: false, shortUrl: false })
  const { WrappedComponent: ConfirmDelete, openModal } = useModal({
    title: 'Внимание',
    text: 'Вы точно хотите удалить ссылку?',
    actions: [
      { text: 'Нет', isCancel: true },
      {
        text: 'Да',
        onClick: async ({ closeModal }) => {
          const { ok, message } = await api.deleteShort(id, isOwn as number)

          if (ok) {
            onDelete?.()
            showToast.success('Ссылка удалена')
          } else {
            closeModal()
            showToast.error(message)
          }
        },
      },
    ],
  })

  const selectAndCopy = (type: string, text: string) => () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((prev) => ({
        ...prev,
        [type]: true,
      }))

      setTimeout(() => {
        setCopied((prev) => ({
          ...prev,
          [type]: false,
        }))
      }, copiedTime)
    })
  }
  const open = (urlToOpen: string) => () => {
    window.open(urlToOpen, '_blank')
  }

  return (
    <ShortWrapper>
      <FormTitle variant="h6">
        Ваша ссылка{' '}
        <CopiedText className={copied.url ? 'copied' : ''}>
          скопировано
        </CopiedText>
      </FormTitle>
      <TextField
        value={url}
        fullWidth
        inputProps={{
          readOnly: true,
        }}
        InputProps={{
          endAdornment: (
            <>
              <Tooltip title="Перейти">
                <IconButton onClick={open(url)}>
                  <OpenInNewIcon sx={{ color: '#1D1F21' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Скопировать">
                <IconButton onClick={selectAndCopy('url', url)}>
                  <ContentCopyIcon sx={{ color: '#1D1F21' }} />
                </IconButton>
              </Tooltip>
            </>
          ),
        }}
      />
      <FormTitle variant="h6" sx={{ mt: '10px' }}>
        Укорочённая ссылка{' '}
        <CopiedText className={copied.shortUrl ? 'copied' : ''}>
          скопировано
        </CopiedText>
      </FormTitle>
      <ShortViewWrapper>
        <TextField
          value={shortUrl}
          inputProps={{
            readOnly: true,
          }}
          sx={{ width: isView ? '50%' : '100%' }}
          InputProps={{
            endAdornment: (
              <Tooltip title="Скопировать">
                <IconButton onClick={selectAndCopy('shortUrl', shortUrl)}>
                  <ContentCopyIcon sx={{ color: '#1D1F21' }} />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
        {isView && (
          <>
            <ShortInfo>
              <Box>
                Дата добавления: <span>{formatter.format(date)}</span>
              </Box>
              <Box>
                Кол-во переходов: <span>{clicks}</span>
              </Box>
            </ShortInfo>
            <Button
              sx={{ ml: 'auto', alignSelf: 'center' }}
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
              onClick={openModal}
            >
              Удалить
            </Button>
            <ConfirmDelete />
          </>
        )}
      </ShortViewWrapper>
    </ShortWrapper>
  )
}

export default Short
