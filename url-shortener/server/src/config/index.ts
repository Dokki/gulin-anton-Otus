export const host = 'http://localhost'

export const developmentConfig = {
  backend: {
    url: `${host}:4000`,
    port: 4000,
  },
  frontend: {
    url: `${host}:3000`,
    port: 3000,
  },
}

export const productionConfig = {
  backend: {
    url: `${host}:4000`,
    port: 4000,
  },
  frontend: {
    url: `${host}:3000`,
    port: 3000,
  },
}

export const isProduction = process.env.NODE_ENV === 'production'
export const config = isProduction ? productionConfig : developmentConfig

export const tokenSecret = 'This is secret code'
export const algorithm = 'HS256'
export const expiresIn = '1d'
export const expiresInRemember = '7d'
