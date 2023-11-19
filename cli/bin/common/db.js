import { readFile, writeFile } from 'node:fs/promises'
import { dirname, normalize, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// Имитация базы данных
const dataBaseName = join(
  normalize(dirname(fileURLToPath(import.meta.url))),
  'base.json',
)
const dataBaseTableUserName = 'user'
const dataBaseTableUsersName = 'users'
const authExpiresIn = 1000 * 60 * 60 * 24 // Одни сутки
const parseBase = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return { user: '', users: [] }
  }
}
// Проверяем последнего юзера, был ли логин
export const getCurrentUsername = async (baseParam) => {
  const data = baseParam ? {} : await readFile(dataBaseName, 'utf8')
  const base = baseParam ? baseParam : parseBase(data)
  const username = base[dataBaseTableUserName]

  return {
    username,
    base,
  }
}
// Имитация взятия данных с базы
export const getUser = async (login, baseParam) => {
  const data = baseParam ? {} : await readFile(dataBaseName, 'utf8')
  const base = baseParam ? baseParam : parseBase(data)
  const users = base[dataBaseTableUsersName]

  return {
    user: users.find((userLocal) => userLocal.login === login),
    base,
  }
}
// Имитация сохранения данных с базы
export const setUser = async (user, base) => {
  const baseLocal = base ? base : await readFile(dataBaseName, 'utf8')
  const users = baseLocal[dataBaseTableUsersName]
  const userIndex = users.findIndex(
    (userLocal) => userLocal.login === user.login,
  )

  if (userIndex < 0) users.push(user)
  else users.splice(userIndex, 1, user)

  await writeFile(dataBaseName, JSON.stringify(baseLocal), { encoding: 'utf8' })
}
// Установка авторизации пользователя
export const setAuth = async (userLocal, baseParam) => {
  const { user, base } = await getUser(userLocal.login, baseParam)

  base.user = userLocal.login

  await setUser(
    { ...user, ...userLocal, expires: Date.now() + authExpiresIn },
    base,
  )
}
// Проверка авторизации по времени
const isUserAuth = (time) => Date.now() < time
// Проверка авторизации пользователя
export const getAuth = async (baseParam) => {
  const { username, base } = await getCurrentUsername(baseParam)

  if (!username) return false

  const { user } = await getUser(username, base)
  // Проверяем если уже логинился
  if (user && isUserAuth(user.expires)) {
    // Обновляем expires
    await setAuth(user, base)

    return true
  }
  // Если нет такого пользователя или нет авторизации.
  return false
}
