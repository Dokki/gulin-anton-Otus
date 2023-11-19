import enquirer from 'enquirer'

import { getUser, setAuth } from '../common/db.js'
import { logger } from '../common/helpers.js'

const authPrompt = async () => {
  const AuthPrompt = enquirer.AuthPrompt.create((value) => value)
  const prompt = new AuthPrompt({
    name: 'password',
    message: 'Please enter your password',
    login: '',
    password: '',
    choices: [
      {
        name: 'login',
        message: 'username',
      },
      {
        name: 'password',
        message: 'password',
        format(input) {
          let color = this.state.submitted
            ? this.styles.primary
            : this.styles.muted

          return color(this.symbols.asterisk.repeat(input.length))
        },
      },
    ],
  })

  return await prompt.run()
}

const selectTypes = { again: 'again', singUp: 'singUp', quit: 'quit' }
const selectPrompt = async () => {
  const prompt = new enquirer.Select({
    name: 'choose',
    message: 'Such user not exist. Choose item:',
    choices: [
      {
        message: 'Try a different username and password',
        value: selectTypes.again,
      },
      { message: 'Sing up', value: selectTypes.singUp },
      { message: 'Quit', value: selectTypes.quit },
    ],
  })

  return await prompt.run()
}

const validate = (name, value) => {
  if (!value || value.length < 3) {
    logger.fail(`Field ${name} must have minimum 3 symbols`)
    return false
  }

  return true
}

const action = (isSingUp) => async () => {
  const { login, password } = await authPrompt()

  if (isSingUp) {
    if (validate('login', login) && validate('password', password)) {
      const { user, base } = await getUser(login)

      if (user) logger.fail(`User with login ${login} already exist`)
      else {
        await setAuth({ login, password }, base)

        logger.success(
          `User with login ${login} successfully created. Now you can use utility.`,
        )
      }
    }

    return
  }

  const { user, base } = await getUser(login)

  if (user && user.password === password) {
    await setAuth(user, base)
    logger.success(`Hello ${user.login}! You are logged in.`)
  } else {
    const answer = await selectPrompt()

    if (answer === selectTypes.again) await action()()
    else if (answer === selectTypes.singUp) await action(true)()
  }
}

export default (program) => {
  program.command('auth').description('Command for log in').action(action())
}
