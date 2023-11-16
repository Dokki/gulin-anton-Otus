import ShortForm from 'components/pages/ShortForm'
import NotFound from 'components/pages/NotFound'
import Shorts from 'components/pages/Shorts'

const isBoolean = (bool: unknown) => typeof bool === 'boolean'
export const menuNames: Record<string, string> = {
  create: 'create',
  shorts: 'shorts',
  notFound: 'notFound',
}
export const menuList = [
  {
    label: 'Создать Short',
    menu: menuNames.create,
    page: ShortForm,
    auth: false,
  },
  { label: 'Мои Shorts', menu: menuNames.shorts, page: Shorts, auth: true },
]

export const getMenuPage = (menuSelf: string) => {
  const item = menuList.find(({ menu }) => menu === menuSelf)

  return {
    item: { ...item, auth: isBoolean(item?.auth) ? item?.auth : false },
    Page: item ? item.page : NotFound,
  }
}
