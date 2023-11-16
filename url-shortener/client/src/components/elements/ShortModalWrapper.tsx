import React from 'react'
import { modalNames } from 'components/helpers/modals'
import { TShort } from '../../../../shared'
import Short from '../elements/Short'
import { useContextStore } from 'store'

const ShortModalWrapper = () => {
  const shortModal = useContextStore(({ modals }) =>
    modals.find(({ name }) => name === modalNames.short),
  )
  const short = shortModal?.data() as TShort

  return <Short short={short} />
}

export default ShortModalWrapper
