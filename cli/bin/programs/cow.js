import cow from 'cowsay'

import { logger } from '../common/helpers.js'

export default (program) => {
  program
    .command('cow', { isDefault: true })
    .description('Ask cow to say a words.')
    .argument('[text]', 'Words for cow to say')
    .argument('[eyes]', 'Symbols for eyes', '^^')
    .action((text, eyes) => {
      logger.log(
        cow.say({
          text: text || 'Hello dude!',
          e: eyes,
        }),
      )

      if (!text) program.help()
    })
}
