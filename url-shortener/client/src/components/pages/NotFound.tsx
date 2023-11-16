import React, { FC } from 'react'
import { NotFoundContainer } from '../style'

const NotFound: FC = () => {
  return (
    <NotFoundContainer maxWidth="lg">
      <div>404 - Ни чего не найдено :(</div>
      Возможно ссылка была удалена
      <br />
      Или ни когда не существовала.
    </NotFoundContainer>
  )
}

export default NotFound
