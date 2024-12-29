## console-progress

可以在 NodeJS 程序中展示进度条，用于任务处理进度的可视化反馈。

### usage

```ts
import { SingleLine } from '@feng-j/console-progress'

const line = new SingleLine()
line.start(100, 0)
line.update(100)
```
