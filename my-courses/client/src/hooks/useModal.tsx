import React, { FC, useState, useCallback, MouseEvent } from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import { styled } from '@mui/system'

type TSetter = () => void
type TSetterData = (data: unknown) => void
type TUseModalAction = {
  text?: string
  isCancel?: boolean
  onClick?: (
    props: {
      event: MouseEvent<HTMLButtonElement>
      openModal: TSetterData
      closeModal: TSetter
      toggleModal: TSetterData
    },
    data: unknown,
  ) => void
}
type TUseModal = {
  title?: string
  text?: string
  actions?: TUseModalAction[]
}

const Close = styled(IconButton)`
  position: absolute;
  right: 10px;
  top: 10px;
`

export default ({ title = 'Modal', text = '', actions = [] }: TUseModal) => {
  const [isOpened, setIsOpened] = useState(false)
  const [data, setData] = useState<unknown>()
  const openModal = (dataLocal?: unknown) => {
    setIsOpened(true)
    setData(dataLocal)
  }
  const closeModal = () => {
    setIsOpened(false)
    setData(undefined)
  }
  const toggleModal = (dataLocal?: unknown) => {
    if (isOpened) setData(dataLocal)
    else setData(undefined)

    setIsOpened(!isOpened)
  }
  const handleAction =
    (action: TUseModalAction) => (event: MouseEvent<HTMLButtonElement>) =>
      action.isCancel || !action.onClick
        ? closeModal()
        : action.onClick({ event, openModal, closeModal, toggleModal }, data)

  const WrappedComponent: FC<Omit<DialogProps, 'open'>> = useCallback(
    ({ children, ...props }) => (
      <Dialog
        fullWidth
        maxWidth="sm"
        {...props}
        open={isOpened}
        onClose={closeModal}
      >
        <DialogTitle>
          {title}
          <Close onClick={closeModal}>
            <CloseIcon />
          </Close>
        </DialogTitle>
        <DialogContent>
          {text && <DialogContentText>{text}</DialogContentText>}
          {children}
        </DialogContent>
        {actions?.length > 0 && (
          <DialogActions>
            {actions.map((action) => (
              <Button key={action.text} onClick={handleAction(action)}>
                {action.text}
              </Button>
            ))}
          </DialogActions>
        )}
      </Dialog>
    ),
    [isOpened],
  )

  WrappedComponent.displayName = 'useModal/WrappedComponent'

  return {
    isOpened,
    openModal,
    closeModal,
    toggleModal,
    WrappedComponent,
  }
}
