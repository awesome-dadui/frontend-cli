const fs = require('fs');
const path = require('path');

/**
 * 递归拷贝、读取目录下所有文件和目录
 * from 源目录
 * to 目标目录
 * */
function copy (from, to) {
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
          copyFile(newFromPath, newToPath)
          console.log(newToPath)
        }
        if (stat.isDirectory()) {
          copy(newFromPath, newToPath)
        }
      })
    })
  })
}

function copyFile (from, to) {
  fs.copyFileSync(from, to, function (err) {
    if (err) {
      console.log(err)
      return
    }
  })
}

function copyFile2 (from, to, formart) {
  let content = fs.readFileSync(from, 'utf-8');

  formart && (content = formart(content));

  fs.writeFile(to, content, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

function copyFile3 (pageName, from, to, formart) {
  console.log(pageName, from, to)
  let content = fs.readFileSync(from, 'utf-8');

  formart && (content = formart(content));

  fs.exists(`${pageName}`, function (err) {
    console.log('fs.exists err:', err)
    if (!err) {
      fs.mkdir(`${pageName}`, (err) => {
        console.log('fs.mkdir:', err)
        if (err) {
          return
        }

        fs.writeFile(to, content, err => {
          if (err) {
            console.error(err)
            return
          }
        })
      })
    } else {
      fs.writeFile(to, content, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

module.exports = {
  copy,
  copyFile2,
  copyFile3
}