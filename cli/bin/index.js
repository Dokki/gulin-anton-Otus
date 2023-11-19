#!/usr/bin/env node

import { Command } from 'commander'
import cowProgram from './programs/cow.js'
import listProgram from './programs/list.js'
import initProgram from './programs/init.js'
import viewProgram from './programs/view.js'
import authProgram from './programs/auth.js'
import createProgram from './programs/create.js'
import renameProgram from './programs/rename.js'
import updateProgram from './programs/update.js'
import deleteProgram from './programs/delete.js'

const program = new Command()

cowProgram(program)
initProgram(program)
authProgram(program)
listProgram(program)
viewProgram(program)
createProgram(program)
renameProgram(program)
updateProgram(program)
deleteProgram(program)

program.parse()

const options = program.opts()

if (
  !program.args.length &&
  !program.commands.length &&
  !Object.keys(options).length
) {
  program.help()
}
