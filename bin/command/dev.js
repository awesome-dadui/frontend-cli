const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const babel = require('@babel/core')
const moment = require('moment')

function devCommand() {
  chokidar
    .watch('.', {
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/.idea/**",
      ],
    })
    .on('all', (event, file) => {
      console.log(event, file)

      if (!['.js', '.css', '.tpl'].includes(path.extname(file)))
        return

      switch (event) {
        case 'add':

          break
        case 'change':
          onChangeFileListener(file)
          break
        case 'unlink':

          break
      }
    })
}

function onChangeFileListener(file) {
  let fileExtname = path.extname(file)
  let fileName = path.basename(file, fileExtname)
  let fileBaseName = path.basename(file)
  let inputPath = path.resolve(file)
  let outputPath = inputPath.replace('src', 'dist')
  console.log('inputPath   :', inputPath)
  console.log('outputPath  :', outputPath)

  switch (fileExtname) {
    case ".js":
      babel.transformFile(inputPath, {
        presets: [require.resolve("@babel/preset-env")],
        compact: true,
        minified: true,
      }, function (err, result) {
        // console.log(err, result)
        let code = `window.snadbox(\"define(function (require, exports, module) {${result.code.replace(/"|'/g, '\\"').replace(/\n/g, '\\n')}})\");`
        console.log(code)

        fs.writeFile(outputPath, code, err => {
          if (err) return
          console.log('文件编译写入成功:', outputPath)
        })
      })
      break
    default:
      fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) return
        fs.writeFile(outputPath, data, (err) => {
          if (err) return
          console.log(`${moment().format('YYYY-MM-DD HH:mm:ss:SSS')} 文件写入成功:`, outputPath)
        })
      })
      break
  }
}

module.exports = {
  devCommand
}