import { menuNames } from './menu'

export const parseHash = (hash: string) => {
  const result = { menu: menuNames.create, page: 1 }

  if (hash) {
    const [menu = menuNames.create, page = '1'] = hash.slice(1).split(':')

    result.menu = menuNames[menu] ? menu : menuNames.create
    result.page = parseInt(page, 10) || 1
  }

  return result
}
