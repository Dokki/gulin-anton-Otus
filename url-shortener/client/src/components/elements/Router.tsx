import React, { useEffect } from 'react'
import { useAuthStore, useContextStore, setContext } from 'store'
import { getMenuPage, menuNames } from '../helpers/menu'
import api from 'api'

const Router = () => {
  const isAuth = useAuthStore((store) => !!store.token)
  const currentMenu = useContextStore((store) => store.menu)

  const { Page, item } = getMenuPage(currentMenu)

  if (item.auth && !isAuth) {
    setContext({ menu: menuNames.create })
  }

  useEffect(() => {
    const ping = async () =>
      api.ping(window.location.pathname).then((success) => {
        if (!success) {
          setContext({ menu: menuNames.notFound })
        }
      })

    if (currentMenu !== menuNames.shorts) {
      ping()
    }
  }, [])

  return <Page />
}

export default Router
