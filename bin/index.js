#!/usr/bin/env node

'use strict'

const program = require('commander')
const config = require('../package.json')

const {initCommand} = require('./cmd/init')
const {devCommand} = require('./cmd/dev')
const {addCommand} = require('./cmd/add')

program.version(config.version)

program
  .command('init')
  .description('初始化项目模版（pixi、react、vue）')
  .action(() => {
    initCommand()
  })

program
  .command('dev')
  .description('开发项目')
  .action(() => {
    devCommand()
  })

program
  .command('add')
  .description(`增加物料：-a增加api（fe add -a），-c增加组件(fe add -c <name>)，-p增加页面（fe add -p <args...>）`)
  .option(`-a, --api`)
  .option(`-c, --component <name>`)
  .option(`-p, --page <args...>`)
  .action((options) => {
    addCommand(options)
  })

program.parse(process.argv)