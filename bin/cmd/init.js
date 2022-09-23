const path = require('path')
const inquirer = require('inquirer')
const clone = require('git-clone')
const shell = require('shelljs')
const log = require('tracer').colorConsole()
const {copy} = require('../utils/file')

function initCommand() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名',
      filter(val) {
        return val
      }
    },
    {
      type: 'list',
      name: 'source',
      message: '请选择克隆源',
      choices: ['local', 'github'],
      filter(val) {
        return val
      }
    },
    {
      type: 'list',
      name: 'type',
      message: '请选择使用的模板',
      choices: ['pixi', 'vue', 'react'],
      filter(val) {
        return val.toLowerCase()
      }
    }
  ]).then(answers => {
    console.log('answers', answers)
    let {projectName, source, type} = answers
    let sourcePath = path.resolve(__dirname, `../template/project/${type}`)
    let targetPath = path.resolve(`./${projectName}`)
    // console.log(sourcePath)
    // console.log(targetPath)

    if (source === 'local') {
      copy(sourcePath, targetPath)
    } else if (source === 'github') {
      console.log('github克隆项目有问题,待开发...')
      return
      clone(sourcePath, targetPath, null, function () {
        log.info('项目构建完成')
        shell.rm('-rf', `./${projectName}/.git`)
        log.info(`清除掉${projectName}的git, 记得进入项目npm install`)
      })
    }
  })
}

module.exports = {
  initCommand
}
