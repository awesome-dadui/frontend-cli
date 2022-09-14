const inquirer = require('inquirer')
const clone = require('git-clone')
const shell = require('shelljs')
const log = require('tracer').colorConsole()

const {copy} = require('./util/file')

const projectUrl = {
  'project-template': path.resolve(__dirname, `../template/project`),
  'empty-vue-template': 'https://github.com/murongqimiao/joao-template',
}

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
      choices: ['project-template', 'empty-vue-template', '模板2', '模板3'],
      filter(val) {
        return val.toLowerCase()
      }
    }
  ]).then(answers => {
    console.log('answers', answers)
    const {projectName, source, type} = answers
    // console.log(projectName, source, type);

    let sourcePath = projectUrl[type]
    let targetPath = `./${projectName}`
    if (source === 'local') {
      copy(sourcePath, targetPath)
    } else if (source === 'github') {
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
