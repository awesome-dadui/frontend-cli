const path = require('path')
const fs = require('fs')
const {copy} = require('../utils/file')

function addCommand(options) {
  console.log('add command called', options)

  if (options.api) {
    // console.log("add api")
    let sourcePath = path.resolve(__dirname, `../template/api`)
    let targetPath = path.resolve(`./api`)
    // console.log(sourcePath)
    // console.log(targetPath)

    copy(sourcePath, targetPath)
  }

  if (options.component) {
    let componentName = options.component
    let sourceFile = path.resolve(__dirname, `../template/component/template.vue`)
    let targetFile = path.resolve(`./${componentName}.vue`)
    // console.log(sourceFile)
    // console.log(targetFile)

    let content = fs.readFileSync(sourceFile, 'utf-8')
      .replace(/class="template"/g, `class="${componentName}"`)
      .replace(/name: 'template'/g, `name: '${componentName}'`)
      .replace(/\.template/g, `.${componentName}`)

    fs.writeFile(targetFile, content, err => {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  if (options.page) {
    let args = options.page
    if (args.length) {
      let name = args[0];
      ['.dml', '.dss', '.js'].forEach((suffix, idx) => {
        let sourceFile = path.resolve(__dirname, `../template/page/demo/demo${suffix}`)
        let targetFile = path.resolve(`./${name}/${name}${suffix}`)
        let targetDir = path.dirname(targetFile)
        // console.log(sourceFile)
        // console.log(targetFile)
        // console.log(targetDir)

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir)
        }

        fs.copyFileSync(sourceFile, targetFile)
      })
    }
  }
}

module.exports = {
  addCommand
}