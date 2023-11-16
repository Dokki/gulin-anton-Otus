import Joi, { ObjectSchema } from 'joi'
import { RequestHandler } from 'express'
import expressJoi from 'express-joi-validation'
import { config, host } from '../config/index.js'

const validator = expressJoi.createValidator({ passError: true })
const headerError = 'Что то не так с запросом'

export const schemas: Record<string, ObjectSchema> = {
  defaultHeaders: Joi.object({
    'x-requested-with': Joi.string()
      .required()
      .allow('XMLHttpRequest')
      .messages({
        'any.only': headerError,
        'any.required': headerError,
      }),
    referer: Joi.string()
      .required()
      .domain()
      .allow(config.frontend.url + '/')
      .messages({
        'any.only': headerError,
        'any.required': headerError,
        'string.domain': headerError,
      }),
    host: Joi.string()
      .required()
      .domain()
      .allow(`${host.replace('http://', '')}:${config.backend.port}`)
      .messages({
        'any.only': headerError,
        'any.required': headerError,
        'string.domain': headerError,
      }),
  }),
  registration: Joi.object({
    firstName: Joi.string()
      .trim()
      .required()
      .min(3)
      .messages({
        'any.required': 'Введите имя',
        'string.min': 'Минимальная длина поля {#label} {#limit} символа',
      })
      .label('Имя'),
    lastName: Joi.string()
      .trim()
      .required()
      .min(3)
      .messages({
        'any.required': 'Введите фамилию',
        'string.min': 'Минимальная длина поля {#label} {#limit} символа',
      })
      .label('Фамилия'),
    email: Joi.string().trim().required().email().messages({
      'any.required': 'Введите email',
      'string.email': 'Введите валидный email',
    }),
    password: Joi.string()
      .trim()
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .messages({
        'any.required': 'Введите пароль',
        'string.pattern.base': 'Введите валидный пароль',
      }),
    repeatPassword: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages({
        'any.required': 'Введите пароль',
        'any.only': 'Введенные пароли неравны',
      }),
    extra: Joi.string().optional(),
  }).with('password', 'repeatPassword'),
  login: Joi.object({
    email: Joi.string().trim().required().email().messages({
      'any.required': 'Введите email',
      'string.email': 'Введите валидный email',
    }),
    password: Joi.string().trim().required().messages({
      'any.required': 'Введите пароль',
    }),
    remember: Joi.string().optional(),
  }),
  shortAdd: Joi.object({
    url: Joi.string().trim().required().uri().messages({
      'string.uri': 'Введите валидную ссылку',
      'any.required': 'Введите ссылку',
    }),
    short: Joi.string()
      .trim()
      .optional()
      .min(7)
      .allow('')
      .pattern(/^[0-9a-zA-Z-_]*$/)
      .messages({
        'string.min': 'Длинна вашего опционального URL должна быть больше 6',
        'string.pattern.base':
          'Введите валидную ссылку для опционального URL, доступны только числа, буквы, тире.',
      }),
  }),
}

type TSchemasKeys = keyof typeof schemas
type TTypes = 'body' | 'query' | 'params' | 'headers' | 'fields' | 'response'
type TValidatorMiddleware = (
  name?: string,
  type?: TTypes,
  also?: Record<
    'body' | 'query' | 'params' | 'headers' | 'fields' | 'response',
    TSchemasKeys | TSchemasKeys[]
  >,
) => RequestHandler[]

const createValidatorBySchema = (
  name = '',
  type: TTypes,
): RequestHandler | null => {
  const schema = schemas[name]
  const requestHandler = validator[type]

  if (schema && typeof requestHandler === 'function')
    return requestHandler(schema)
  else return null
}

export const validatorMiddleware: TValidatorMiddleware = (
  name = '',
  type = 'body',
  also,
) => {
  const validators: Array<RequestHandler | null> = [
    createValidatorBySchema(name, type),
  ]
  const alsoKeys = Object.keys(also || {}) as TTypes[]

  if (alsoKeys.length)
    alsoKeys.forEach((key) => {
      const schemasLocal = also && also[key]

      if (Array.isArray(schemasLocal))
        return validators.push(
          ...schemasLocal.map((schema) => createValidatorBySchema(schema, key)),
        )
      else return validators.push(createValidatorBySchema(schemasLocal, key))
    })

  return [
    validator.headers(schemas.defaultHeaders),
    ...(validators.filter(Boolean) as RequestHandler[]),
  ]
}
