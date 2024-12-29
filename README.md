## console-progress

可以在 NodeJS 程序中展示进度条，用于任务处理进度的可视化反馈。

### usage

params：
+ name(string)：任务标题
+ leftChar(string)：进度条左侧已完成部分字符
+ rightChar(string)：进度条右侧未完成部分字符
+ showPercent(boolean)：是否显示百分比
+ showTask(boolean)：是否显示任务处理数量
+ hideCursor(boolean)：隐藏终端光标

```ts
import { SingleLine } from '@feng-j/console-progress'

const line = new SingleLine({ name: 'download book' })
line.start(100, 0)
line.update(100)
```
使用效果
![result](/static/img.png)
