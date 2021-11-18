#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const program = require('commander');
const inquirer = require('inquirer');
const clone = require('git-clone');
const shell = require('shelljs');
const log = require('tracer').colorConsole();

const package = require('../package.json');
const {copy, copyFile2} = require('./file');

function resolvePath (dir) {
  return path.resolve(__dirname, '../', dir);
}

const projectUrl = {
  'project-template': resolvePath('./template/project'),
  'empty-vue-template': 'https://github.com/murongqimiao/joao-template',
}

program
  .version(package.version)
  .option('-d, --do', 'Do something', 'writing code')
  .action(function (task) {
    console.log(`Do this `, task);
  });

program
  .command('init')
  .description('初始化项目模版')
  .alias('i')
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

program
  .command('add')
  .description('增加物料：-c增加组件(damll add -c name)，-p增加页面（dmall add -p name）')
  .option('-a, --api')
  .option('-c, --component <name>')
  .option('-p, --page <name>')
  .action((options) => {
    // console.log('add command called', options)

    if (options.api) {
      // console.log("add api")
      let sourcePath = resolvePath('./template/api');
      let targetPath = `./api`;
      copy(sourcePath, targetPath);
    }

    if (options.component) {
      let componentName = options.component;
      // console.log("componentName:", componentName);
      let sourceFile = resolvePath('./template/component/template.vue');
      let targetFile = `./${componentName}.vue`;

      copyFile2(sourceFile, targetFile, function (content) {
        content = content.replace(/class="template"/g, `class="${componentName}"`);
        content = content.replace(/name: 'template'/g, `name: '${componentName}'`);
        content = content.replace(/\.template/g, `.${componentName}`);
        return content;
      })
    }

    if (options.page) {
      let pageName = options.page;
      // console.log("pageName:", pageName);

      ['.dml', '.dss', '.js'].forEach((suffix, idx) => {
        let sourceFile = resolvePath(`./template/page/demo/demo${suffix}`);
        let targetFile = `./${pageName}/${pageName}${suffix}`;

        copyFile(sourceFile, targetFile);
      })
    }
  })

function copyFile (from, to) {
  mkdirsSync(path.dirname(to));

  fs.copyFileSync(from, to, function (err) {
    if (err) {
      console.log(err)
      return
    }
  });
}

function mkdirsSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

program.parse(process.argv);