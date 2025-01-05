import { BaseLine, PayloadType, ProgressOption } from './baseLine'
import * as process from 'node:process'
import ansiEscapes from 'ansi-escapes'
import { EOL } from 'node:os'

export interface MultiLineOption extends ProgressOption {
	log?: boolean
	hideCursor?: boolean
}

const defaultMultiLineOption: MultiLineOption = {
	log: true,
	hideCursor: true
}

interface MultiLineItem extends BaseLine {
	originUpdate(finishedTask: number, data?: PayloadType): void
	originIncrement(step: number, data?: PayloadType): void
}

export class MultiLine {
	private readonly lineOption: MultiLineOption
	private lines: Array<MultiLineItem> = []
	private cursor: number = 0

	constructor(option?: MultiLineOption) {
		this.lineOption = {
			...defaultMultiLineOption,
			...option
		}
	}

	private write(...chunks: Parameters<typeof process.stdout.write>) {
		if (!this.lineOption.log) {
			return
		}
		process.stdout.write.call(process.stdout, ...chunks)
	}

	/**
	 * 检查索引是否越界
	 * @param index
	 * @private
	 */
	private checkIndex(index: number) {
		if (index >= this.lines.length) {
			throw new RangeError('Index out of bounds.')
		}
	}

	/**
	 * 更新进度条
	 * @param index 索引
	 * @param finishedTask 已完成任务数量
	 * @param data 自定义渲染数据
	 */
	update(index: number, finishedTask: number, data?: PayloadType) {
		this.checkIndex(index)
		this.lines[index].originUpdate(finishedTask, data)
		this.log()
	}

	/**
	 * 增加进度条
	 * @param index 索引
	 * @param step 步进数量
	 * @param data 自定义渲染数据
	 */
	increment(index: number, step: number = 1, data?: PayloadType) {
		this.checkIndex(index)
		this.lines[index].originIncrement(step, data)
		this.log()
	}

	/**
	 * 创建进度条
	 * @param allTaskCount 全部任务数量
	 * @param current 已完成任务数量
	 * @param option 进度条配置
	 * @param data 自定义渲染数据
	 */
	create(
		allTaskCount: number,
		current: number = 0,
		option: ProgressOption = {},
		data?: PayloadType
	) {
		const line = new BaseLine({ ...this.lineOption, ...option }) as MultiLineItem
		this.lines.push(line)
		const index = this.cursor++
		line.start(allTaskCount, current, data)

		if (index === 0) {
			// 光标控制
			if (this.lineOption.hideCursor) {
				this.write(ansiEscapes.cursorHide)
			}
			this.write(ansiEscapes.cursorSavePosition)
		}

		this.log()

		// 绑定方法
		line.originUpdate = line.update
		line.originIncrement = line.increment
		line.increment = this.increment.bind(this, index)
		line.update = this.update.bind(this, index)

		return line as BaseLine
	}

	/**
	 * 输出进度条
	 * @private
	 */
	private log() {
		this.write(ansiEscapes.cursorRestorePosition)
		this.write(this.render())

		if (this.lines.every(line => line.isFinished())) {
			this.stop()
		}
	}

	/**
	 * 渲染进度条
	 */
	render() {
		return this.lines.map(line => line.render()).join('\n')
	}

	/**
	 * 获取进度条list
	 */
	getLines() {
		return this.lines
	}

	/**
	 * 停止进度条
	 */
	stop() {
		this.write(ansiEscapes.cursorShow)
		this.write(EOL)
	}
}
