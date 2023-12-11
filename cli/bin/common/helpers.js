import chalk from 'chalk'

/**
 * Logger
 * @param args {string | number | boolean | object | array}
 * @return {string[]}
 */
const argsToString = (...args) =>
  args.map((arg) => {
    if (typeof arg === 'object') return JSON.stringify(arg)

    return arg
  })

const methods = {
  log: { level: 2, color: 'blue' },
  info: { level: 1, color: 'gray' },
  error: { level: 4, color: 'red' },
  warn: { level: 3, color: 'yellow' },
  fail: { level: 0, color: 'red', method: 'log' },
  print: { level: 0, color: 'cyan', method: 'log' },
  success: { level: 0, color: 'green', method: 'log' },
}
const parseLevel = () => {
  const { argv } = process
  let verbose = 4
  let length = argv.length
  let i = 0

  for (; i < length; i++) {
    if (['-v', '--verbose'].includes(argv[i])) {
      verbose = parseInt(argv[i + 1], 10)
      break
    }
  }

  return isNaN(verbose) ? 4 : verbose
}

/**
 * Logger
 * @return {{
 *  log: (...args: Array<string | number | object>) => void,
 *  info: (...args: Array<string | number | object>) => void,
 *  warn: (...args: Array<string | number | object>) => void,
 *  fail: (...args: Array<string | number | object>) => void,
 *  error: (...args: Array<string | number | object>) => void,
 *  print: (...args: Array<string | number | object>) => void,
 *  success: (...args: Array<string | number | object>) => void
 * }}
 */
const Logger = () => {
  const level = parseLevel()

  return Object.keys(methods).reduce((acc, method) => {
    const opts = methods[method]
    const conMethod = opts.method ? opts.method : method

    acc[method] = (...args) => {
      if (!args.length || opts.level > level) {
        return
      }

      // eslint-disable-next-line no-console
      console[conMethod].call(
        console,
        chalk[opts.color](...argsToString(...args)),
      )
    }

    return acc
  }, {})
}

export const logger = Logger()
