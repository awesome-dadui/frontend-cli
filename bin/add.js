function addCommand(options) {
  console.log('add command called', options)

  if (options.api) {
    // console.log("add api")
    let sourcePath = resolvePath('./template/api')
    let targetPath = `./api`
    copy(sourcePath, targetPath)
  }

  if (options.component) {
    let componentName = options.component
    // console.log("componentName:", componentName);
    let sourceFile = resolvePath('./template/component/template.vue')
    let targetFile = `./${componentName}.vue`

    copyFile2(sourceFile, targetFile, function (content) {
      content = content.replace(/class="template"/g, `class="${componentName}"`)
      content = content.replace(/name: 'template'/g, `name: '${componentName}'`)
      content = content.replace(/\.template/g, `.${componentName}`)
      return content
    })
  }

  if (options.page) {
    let args = options.page
    // console.log("args:", args);

    if (args.length === 1) {
      let name = args[0];
      ['.dml', '.dss', '.js'].forEach((suffix, idx) => {
        let sourceFile = resolvePath(`./template/page/demo/demo${suffix}`)
        let targetFile = `./${name}/${name}${suffix}`

        copyFile(sourceFile, targetFile)
      })
    } else if (args.length === 2) {
      if (args[0] === 'list') {
        let type = 'list'
        let name = args[1];

        ['c-item.vue', 'list.dml', 'list.dss', 'list.js'].forEach((file, idx) => {
          let suffix = path.extname(file)
          let fileName = path.basename(file, suffix)

          let sourceFile = resolvePath(`./template/page/${type}/${file}`)
          let targetFile = `./${name}/${fileName === type ? name : fileName}${suffix}`

          console.log(sourceFile, targetFile, fileName, suffix)
          //
          copyFile(sourceFile, targetFile)
        })
      }
    }
  }
}

function copyFile(from, to) {
  mkdirsSync(path.dirname(to))

  fs.copyFileSync(from, to, function (err) {
    if (err) {
      console.log(err)
      return
    }
  })
}

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

module.exports = {
  addCommand
}