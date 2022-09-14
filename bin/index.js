#!/usr/bin/env node

const program = require('commander')
const package = require('../package.json')

const {initCommand} = require('./command/init')
const {addCommand} = require('./command/add')
// const {devCommand} = require('./command/dev')

program
  .version(package.version)
  .option('-d, --do', 'Do something', 'writing code')
  .action(function (task) {
    console.log(`Do this `, task)
  })

program
  .command('add')
  .description(`增加物料：-a增加api（dmall add -a），-c增加组件(damll add -c <name>)，-p增加页面（dmall add -p <args...>）`)
  .option(`-a, --api`)
  .option(`-c, --component <name>`)
  .option(`-p, --page <args...>`)
  .action((options) => {
    addCommand(options)
  })

program
  .command('init')
  .description('初始化项目模版')
  .alias('i')
  .action(() => {
    initCommand()
  })

/*

program
  .command('dev')
  .action(() => {
    devCommand()
  })*/

program.parse(process.argv)