import chalk from 'chalk'
import { isHEX } from './utils'

export interface ProgressOption {
	leftChar?: string // 已完成部分进度条展示字符串
	leftColor?: string // 已完成部分进度条颜色（HEX）
	rightChar?: string // 未完成部分进度条展示字符串
	rightColor?: string // 未完成部分进度条颜色（HEX）
}

const defaultOption: ProgressOption = {
	leftChar: '\u2588',
	rightChar: '\u2591'
}

export class BaseLine {
	protected readonly progressOption: ProgressOption // 配置项
	protected readonly charLength = 50 // 进度条长度
	protected finishedTask = 0 // 已完成的任务数量
	protected allTask = 0 // 全部的任务数量
	protected percent = 0 // 完成进度

	constructor(option: ProgressOption = {}) {
		if (
			(option.leftColor && !isHEX(option.leftColor)) ||
			(option.rightColor && !isHEX(option.rightColor))
		) {
			// 不是合法的十六进制颜色
			throw new TypeError('custom color must be a hex value.')
		}
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
	 * 更新数据
	 * @param finishedTask 已完成的任务数量
	 * @protected
	 */
	protected update(finishedTask: number) {
		if (finishedTask > this.allTask) {
			// 超出最大值
			throw new RangeError("finished task's count should not be smaller than total")
		}

		this.finishedTask = finishedTask
		this.percent = this.finishedTask / this.allTask
	}

	/**
	 * 任务是否已完成
	 */
	isFinished() {
		return this.finishedTask === this.allTask
	}

	/**
	 * 获取已完成数量
	 */
	getFinishedTaskCount() {
		return this.finishedTask
	}

	/**
	 * 获取全部任务数量
	 */
	getAllTaskCount() {
		return this.allTask
	}

	/**
	 * 渲染进度条
	 */
	progressRender() {
		const leftLen = this.computeFinishedCharLength()
		let str = ''
		if (this.progressOption.leftColor) {
			// 自定义左侧颜色
			str += chalk.hex(this.progressOption.leftColor)(this.progressOption.leftChar).repeat(leftLen)
		} else {
			str += chalk.green(this.progressOption.leftChar).repeat(leftLen)
		}

		if (this.progressOption.rightColor) {
			// 自定义右侧颜色
			str += chalk
				.hex(this.progressOption.rightColor)(this.progressOption.rightChar)
				.repeat(this.charLength - leftLen)
		} else {
			str += this.progressOption.rightChar!.repeat(this.charLength - leftLen)
		}
		return str
	}
}
