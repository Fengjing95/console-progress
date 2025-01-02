import { BaseLine, ProgressOption } from './baseLine'
import ansiEscapes from 'ansi-escapes'
import * as process from 'node:process'
import { EOL } from 'node:os'
import { cleanObject, formatStringTemplate } from './utils'

export interface LineOption extends ProgressOption {
	name?: string
	format?: string
	showPercent?: boolean
	showTask?: boolean
	hideCursor?: boolean
}

const defaultLineOption: LineOption = {
	showPercent: true,
	showTask: true,
	hideCursor: true
}

export class SingleLine extends BaseLine {
	protected readonly lineOption: LineOption
	write = process.stdout.write.bind(process.stdout)

	constructor(option?: LineOption) {
		super(option)
		this.lineOption = {
			...defaultLineOption,
			...option
		}
	}

	/**
	 * 初始化进度条任务数量
	 * @param total 全部的任务数量
	 * @param current 开始时的任务数量，默认为 0
	 * @param data 渲染进度条时需要渲染的数据
	 */
	start(total: number, current: number = 0, data?: Record<string, string | number>) {
		if (this.lineOption.hideCursor) {
			this.write(ansiEscapes.cursorHide)
		}
		this.write(ansiEscapes.cursorSavePosition)

		this.allTask = total
		this.update(current, data)

		return this
	}

	/**
	 * 更新完成的任务数量
	 * @param current 已完成任务数量
	 * @param data 渲染进度条时需要渲染的数据
	 */
	update(current: number, data?: Record<string, string | number>) {
		super.update(current)
		this.log(data)

		if (current === this.allTask) {
			// 完成
			this.stop()
			return
		}
	}

	/**
	 * 步进任务数量
	 * @param step 步进数量
	 * @param data 渲染进度条需要的额外数量
	 */
	increment(step = 1, data?: Record<string, string | number>) {
		this.update(this.finishedTask + step, data)
	}

	/**
	 * 停止进度条
	 */
	stop() {
		this.write(ansiEscapes.cursorShow)
		this.write(EOL)
	}

	/**
	 * 渲染d单行进度条
	 */
	render(data?: Record<string, string | number>) {
		let str = ''
		const dataRecord = {
			name: this.lineOption.name as string,
			bar: this.progressRender(),
			percent: (this.percent * 100).toFixed(2),
			finish: this.finishedTask,
			total: this.allTask,
			...data
		}
		cleanObject(dataRecord)

		if (this.lineOption.format) {
			// 使用声明的格式化输出
			str = formatStringTemplate(this.lineOption.format, dataRecord)
		} else {
			// 默认的输出格式
			str += this.lineOption.name ? `${dataRecord.name} | ` : ''
			str += this.progressRender()
			str += this.lineOption.showTask ? ` | ${dataRecord.finish}/${dataRecord.total} Chunks` : ''
			str += this.lineOption.showPercent ? ` | ${dataRecord.percent}% Percent` : ''
		}
		return str
	}

	/**
	 * 输出进度条
	 * @param data 渲染进度条需要的额外数据
	 * @protected
	 */
	protected log(data?: Record<string, string | number>) {
		this.write(ansiEscapes.cursorRestorePosition)
		this.write(this.render(data))
	}
}
