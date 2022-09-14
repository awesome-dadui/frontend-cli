const files = require.context('./modules', true, /\.js$/)

const modules = files.keys().reduce((modules, path) => {
  // TODO  考虑是否需要分模块增加请求函数命名空间
  // const name = path.replace(/^\.\/|.js$/g, '')
  modules = {
    ...modules,
    ...files(path)
  }
  return modules
}, {})

export default modules