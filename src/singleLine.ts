import { BaseLine, ProgressOption } from './baseLine'
import ansiEscapes from 'ansi-escapes'
import * as process from 'node:process'
import { EOL } from 'node:os'

export interface LineOption extends ProgressOption {
	name?: string
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
	 */
	start(total: number, current: number = 0) {
		if (this.lineOption.hideCursor) {
			this.write(ansiEscapes.cursorHide)
		}
		this.write(ansiEscapes.cursorSavePosition)

		this.allTask = total
		this.update(current)

		return this
	}

	/**
	 * 更新完成的任务数量
	 * @param current
	 */
	update(current: number) {
		if (current > this.allTask) {
			// 超出最大值
			throw new RangeError("finished task's count should not be smaller than total")
		}

		this.finishedTask = current
		this.percent = this.finishedTask / this.allTask
		this.log()

		if (current === this.allTask) {
			// 完成
			this.stop()
			return
		}
		return this
	}

	stop() {
		this.write(ansiEscapes.cursorShow)
		this.write(EOL)
	}

	/**
	 * 渲染d单行进度条
	 */
	render() {
		let str = this.lineOption.name ? `${this.lineOption.name} | ` : ''
		str += this.progressRender()
		str += this.lineOption.showTask ? ` | ${this.finishedTask}/${this.allTask} Chunks` : ''
		str += this.lineOption.showPercent ? ` | ${(this.percent * 100).toFixed(2)}% Percent` : ''
		return str
	}

	log() {
		this.write(ansiEscapes.cursorRestorePosition)
		this.write(this.render())
	}
}
