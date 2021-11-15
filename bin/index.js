#!/usr/bin/env node

const {program} = require('commander');
const fs = require('fs');
const package = require('../package.json');
const readline = require('readline')
const filename = `${__dirname}/data.txt`;

program.version(package.version);

// 解析dmall input 命令和参数
program.command('input').action((source) => {
  // compile(source)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // 监听键入回车事件
  rl.on('line', (str) => {
    // str即为输入的内容
    if (str === 'close') {
      // 关闭逐行读取流 会触发关闭事件
      rl.close()
    }
    console.log(str);
  })

  // 监听关闭事件
  rl.on('close', () => {
    console.log('触发了关闭事件');
  })
});

/*// 解析dmall 命令和参数
program.arguments('<cmd> [env]').action((cmd, env) => {
  console.log(cmd, env);
  compile(cmd)
});*/

// 解析dmall 参数
program.arguments('[text]').action((text) => {
  if (text)
    compile(text)
  else
    console.log('请录入数据,例如dmall @a@b@c')
});

program.parse(process.argv);

function compile (content) {
  fs.appendFile(filename, content, err => {
    if (err) {
      console.error(err)
      return
    }
    run()
  })
}

function run () {
  const content = fs.readFileSync(filename, 'utf-8');
  const arr = content.replace(/\s*/g, '').split('@');
  const result = sort(removeDuplicates(arr));
  console.log('--- 最新榜单 ---')
  result.forEach(item => {
    console.log(`${item.name}: ${item.time}`);
  })
}

// 计数
function removeDuplicates (arr = []) {
  let tempArr = [];
  for (let i = 0; i < arr.length; i++) {
    const index = tempArr.findIndex(k => k.name === arr[i])
    if (index > -1) {
      tempArr[index].time++;
    } else if (!!arr[i]) {
      tempArr.push({
        name: arr[i],
        time: 1
      });
    }
  }
  return tempArr;
}

// 排序
function sort (arr = []) {
  for (let i = 0; i < arr.length; i++) {
    let maxIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j].time > arr[maxIndex].time) {
        maxIndex = j;
      }
    }

    let temp = arr[i];
    arr[i] = arr[maxIndex];
    arr[maxIndex] = temp;
  }
  return arr;
}