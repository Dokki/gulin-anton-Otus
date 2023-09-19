import { dirname } from 'path'
import { fileURLToPath } from 'url'

const rootDirArr = import.meta.url.split('/')

rootDirArr.pop()

export const host = 'http://localhost'

export const developmentConfig = {
  port: 4000,
  allowedOrigin: `${host}:3000`,
}

export const productionConfig = {
  port: 4000,
  allowedOrigin: `${host}:3000`,
}

export const isProduction = process.env.NODE_ENV === 'production'
export const config = isProduction ? productionConfig : developmentConfig

export const tokenSecret = 'This is secret code'
export const algorithm = 'HS256'
export const expiresIn = '1d'
export const expiresInRemember = '7d'
export const imagesAccept = ['jpg', 'jpeg', 'gif', 'png']
export const rootDir = dirname(fileURLToPath(rootDirArr.join('/')))
export const uploadPath = rootDir + '\\images\\'
