import chalk from 'chalk'

export interface ProgressOption {
	leftChar?: string // 已完成部分进度条展示字符串
	// leftColor?: string // 已完成部分进度条颜色（HEX）
	rightChar?: string // 未完成部分进度条展示字符串
	// rightColor?: string // 未完成部分进度条颜色（HEX）
}

const defaultOption: ProgressOption = {
	leftChar: '\u2588',
	// leftColor: 'white',
	rightChar: '\u2591'
	// rightColor: 'white'
}

export class BaseLine {
	protected readonly progressOption: ProgressOption // 配置项
	protected readonly charLength = 50 // 进度条长度
	protected finishedTask = 0 // 已完成的任务数量
	protected allTask = 0 // 全部的任务数量
	protected percent = 0 // 完成进度

	constructor(option: ProgressOption = {}) {
		this.progressOption = {
			...defaultOption,
			...option
		}
	}

	/**
	 * 计算进度条已完成部分的字符串长度
	 * @returns 已完成进度条长度
	 * @private
	 */
	protected computeFinishedCharLength() {
		return Math.floor(this.charLength * Number(this.percent))
	}

	/**
	 * 任务是否已完成
	 */
	get isFinished() {
		return this.finishedTask === this.allTask
	}

	/**
	 * 渲染进度条
	 */
	progressRender() {
		const leftLen = this.computeFinishedCharLength()
		let str = chalk.green(this.progressOption.leftChar).repeat(leftLen)
		str += this.progressOption.rightChar!.repeat(this.charLength - leftLen)
		return str
	}
}
