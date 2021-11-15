#!/usr/bin/env node

const package = require('../package.json');
const commander = require('commander');
const inquirer = require('inquirer');
const clone = require('git-clone');
const shell = require('shelljs');
const log = require('tracer').colorConsole();

// 项目地址
const projectUrl = {
  'empty-vue-template': 'https://github.com/murongqimiao/joao-template', // 空白库
}

const questions = [
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
    name: 'type',
    message: '请选择使用的模板',
    choices: ['empty-vue-template', '模板2', '模板3'],
    filter (val) {
      return val.toLowerCase();
    }
  }
]

commander.version(package.version);

commander
  .command('init')
  .description('用来初始化项目，拉取模版')
  .action((source) => {
    console.log('正在构建...')
    inquirer
      .prompt(questions)
      .then(answers => {
        // console.log('answers', answers)
        const {projectName, type} = answers
        console.log(projectName, type)

        clone(`${projectUrl[type]}`, `./${projectName}`, null, function () {
          log.info('项目构建完成')
          shell.rm('-rf', `./${projectName}/.git`);
          log.info(`清除掉${projectName}的git, 记得进入项目npm install`)
        })
      })
  });

commander.parse(process.argv);