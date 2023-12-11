import React, { FC, PropsWithChildren, useEffect, useRef } from 'react'
import useModal, { TUseModal } from 'hooks/useModal'
import { setModal, removeModal } from 'store'

const Modal: FC<PropsWithChildren<TUseModal & { name: string }>> = ({
  children,
  name,
  title,
  text,
  actions = [],
}) => {
  const { WrappedComponent, openModal, closeModal, isOpened } = useModal({
    title,
    text,
    actions,
  })
  const dataRef = useRef<unknown>()

  useEffect(() => {
    const setData = (dataLocal: unknown) => (dataRef.current = dataLocal)

    setModal({
      name,
      open: (dataLocal) => {
        setData(dataLocal)
        openModal()
      },
      data: (): unknown => dataRef.current,
      close: closeModal,
      setData,
      isOpened: () => isOpened,
    })

    return () => removeModal(name)
  })

  if (isOpened) return <WrappedComponent>{children}</WrappedComponent>

  return null
}

export default Modal
