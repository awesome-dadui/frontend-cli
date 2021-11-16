#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const commander = require('commander');
const inquirer = require('inquirer');
const clone = require('git-clone');
const shell = require('shelljs');
const log = require('tracer').colorConsole();

const package = require('../package.json');
const {copy} = require('./file');

function resolvePath (dir) {
  return path.resolve(__dirname, '../', dir);
}

const projectUrl = {
  'project-template': resolvePath('./template/project'),
  'empty-vue-template': 'https://github.com/murongqimiao/joao-template',
}

commander.version(package.version);

commander
  .command('init')
  .description('初始化项目模版')
  .action(() => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名',
          filter (val) {
            return val;
          }
        },
        {
          type: 'list',
          name: 'source',
          message: '请选择克隆源',
          choices: ['local', 'github'],
          filter (val) {
            return val;
          }
        },
        {
          type: 'list',
          name: 'type',
          message: '请选择使用的模板',
          choices: ['project-template', 'empty-vue-template', '模板2', '模板3'],
          filter (val) {
            return val.toLowerCase();
          }
        }
      ])
      .then(answers => {
        console.log('answers', answers)
        const {projectName, source, type} = answers
        // console.log(projectName, source, type);

        let sourcePath = projectUrl[type];
        let targetPath = `./${projectName}`;
        if (source === 'local') {
          copy(sourcePath, targetPath);
        } else if (source === 'github') {
          clone(sourcePath, targetPath, null, function () {
            log.info('项目构建完成')
            shell.rm('-rf', `./${projectName}/.git`);
            log.info(`清除掉${projectName}的git, 记得进入项目npm install`)
          })
        }
      })
  });

commander
  .command('add')
  .description('创建一个api page component')
  .option('-p, --page', 'Skip prompts and use saved or remote preset')
  .option('-c, --component', 'Use git clone when fetching remote preset')
  .action((name, option) => {
    console.log(name, option)
  })

commander.parse(process.argv);