## console-progress

![last update](https://img.shields.io/npm/last-update/%40feng-j%2Fconsole-progress)
![last commit](https://img.shields.io/github/last-commit/Fengjing95/console-progress)

可以在 NodeJS 程序中展示进度条，用于任务处理进度的可视化反馈。

### 活动

![Alt](https://repobeats.axiom.co/api/embed/2f27f02c439973bb5278ae57da1b2815e07dbec4.svg "Repobeats analytics image")

### usage

#### constructor

构造函数(均为可选参数)：
+ name(string)：任务标题
+ leftChar(string)：进度条左侧已完成部分字符
+ rightChar(string)：进度条右侧未完成部分字符
+ leftColor：已完成部分进度条颜色（HEX颜色）
+ rightColor：未完成部分进度条颜色（HEX颜色）
+ showPercent(boolean)：是否显示百分比
+ showTask(boolean)：是否显示任务处理数量
+ hideCursor(boolean)：隐藏终端光标
+ format(string)：进度条格式，会按照字符串模板进行解析，例如`{name} | {bar} | {percent}% Percent | {finish}/{total} Chunks`，内置的变量有
  + bar：进度条
  + name：任务标题
  + percent：百分比
  + finish：已处理任务数量
  + total：总任务数量

#### start

开始任务，用于设置总任务数量，`(allTask: number, finish: number = 0, formatData?: Record<string, string | number>)`

#### update

更新任务进度，`(finish: number, formatData?: Record<string, string | number>)`

#### increment

按照step推进任务进度，`(step: number = 1, formatData?: Record<string, string | number>)`

```ts
const singleLine = new SingleLine({
  name: 'Test',
  leftColor: '#39c5bb',
  format: `${chalk.red('{name}')} | {bar} | ${chalk.yellow('{percent}% Percent')} | ${chalk.green('{finish}/{total} Chunks')}`
})
singleLine.start(100, 0)

setTimeout(() => {
  singleLine.update(30)

  const timer = setInterval(() => {
    singleLine.increment()
    if (singleLine.isFinished()) {
      clearInterval(timer)
    }
  }, 100)
}, 1000)

```
使用效果
![result](/static/colorFormat.png)

> 文本内容没有自定义颜色配置，如果需要自定义颜色，可以通过format模板配合chalk自行控制，例如
> ```ts
> {
>   format: `${chalk.red('{name}')} | {bar} | ${chalk.yellow('{percent}% Percent')} | ${chalk.green('{finish}/{total} Chunks')}`
> }
> ```
> 
