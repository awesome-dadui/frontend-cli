const path = require('path')
const fs = require('fs')

/**
 * 递归拷贝、读取目录下所有文件和目录
 * from 源目录
 * to 目标目录
 * */
function copy(from, to) {
  const fromPath = path.resolve(from)
  const toPath = path.resolve(to)

  // 判断目标目录是否存在
  fs.access(toPath, function (err) {
    // 目标目录不存在则创建目标目录
    if (err) {
      fs.mkdirSync(toPath)
    }
  })

  fs.readdir(fromPath, function (err, paths) {
    if (err) {
      console.log(err)
      return
    }

    paths.forEach(function (item) {
      const newFromPath = fromPath + '/' + item
      const newToPath = path.resolve(toPath + '/' + item)

      fs.stat(newFromPath, function (err, stat) {
        if (err) return
        if (stat.isFile()) {
          fs.copyFileSync(newFromPath, newToPath)
        }
        if (stat.isDirectory()) {
          copy(newFromPath, newToPath)
        }
      })
    })
  })
}

module.exports = {
  copy
}