创建 & 初始化

$ dmall init

开发 & 实时编译

$ dmall dev

语法检查 & 测试

$ dmall test

构建 & 打包

$ dmall build


/*// 解析dmall 命令和参数
program.arguments('<cmd> [env]').action((cmd, env) => {
  console.log(cmd, env);
  compile(cmd)
});*/

|依赖模块|描述|
|---|---|
|commander|命令行工具|
|inquirer|命令行中可以使用对话或者选项|
|shelljs|用来执行shell|
|tracer|用来画师打log|