```
// 解析fe 命令和参数
program.arguments('<cmd> [env]').action((cmd, env) => {
  console.log(cmd, env);
  compile(cmd)
});
```

|依赖模块|描述|
|---|---|
|commander|命令行工具|
|inquirer|命令行中可以使用对话或者选项|
|shelljs|用来执行shell|
|tracer|用来画师打log|