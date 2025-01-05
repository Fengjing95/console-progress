import chalk from 'chalk'
import { cleanObject, formatStringTemplate, isHEX } from './utils'

export type PayloadType = Record<string, string | number>

export interface ProgressOption {
	leftChar?: string // 已完成部分进度条展示字符串
	leftColor?: string // 已完成部分进度条颜色（HEX）
	rightChar?: string // 未完成部分进度条展示字符串
	rightColor?: string // 未完成部分进度条颜色（HEX）
	name?: string // 任务名称
	format?: string // 格式化输出
	payload?: PayloadType // 自定义渲染数据
}

const format = '{name} | {bar} | {percent}% Percent | {finish}/{total} Chunks'
const noNameFormat = '{bar} | {percent}% Percent | {finish}/{total} Chunks'

const defaultOption: ProgressOption = {
	leftChar: '\u2588',
	rightChar: '\u2591'
}

export class BaseLine {
	private readonly progressOption: ProgressOption // 配置项
	protected readonly charLength = 50 // 进度条长度
	protected finishedTask = 0 // 已完成的任务数量
	protected allTask = 0 // 全部的任务数量
	protected percent = 0 // 完成进度
	protected payload: PayloadType // 自定义渲染数据

	constructor(option: ProgressOption = {}) {
		if (
			(option.leftColor && !isHEX(option.leftColor)) ||
			(option.rightColor && !isHEX(option.rightColor))
		) {
			// 不是合法的十六进制颜色
			throw new TypeError('custom color must be a hex value.')
		}
		this.progressOption = {
			format: option.name ? format : noNameFormat,
			...defaultOption,
			...option
		}
		this.payload = option.payload || {}
	}

	/**
	 * 渲染进度条
	 */
	private progressRender() {
		const leftLen = Math.floor(this.charLength * Number(this.percent))
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

	/**
	 * 开始任务
	 * @param total 全部任务数量
	 * @param current 已完成的任务数量
	 * @param data 自定义渲染数据
	 * @protected
	 */
	start(total: number, current = 0, data?: PayloadType) {
		this.allTask = total
		this.update(current, data)
	}

	/**
	 * 更新数据
	 * @param finishedTask 已完成的任务数量
	 * @param data 自定义渲染数据
	 * @protected
	 */
	update(finishedTask: number, data?: PayloadType) {
		if (finishedTask > this.allTask) {
			// 超出最大值
			throw new RangeError("finished task's count should not be smaller than total")
		}

		if (finishedTask < this.finishedTask) {
			// 进度倒退
			throw new RangeError("finished task's count should not be smaller than current")
		}

		this.finishedTask = finishedTask
		this.percent = this.finishedTask / this.allTask
		this.payload = data || {}
	}

	/**
	 * 步进任务数量
	 * @param step 步进数量
	 * @param data 渲染进度条需要的额外数量
	 */
	increment(step = 1, data?: PayloadType) {
		this.update(this.finishedTask + step, data)
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
	 * 获取任务名称
	 */
	get name() {
		return this.progressOption.name
	}

	/**
	 * 渲染d单行进度条
	 */
	render() {
		const dataRecord = {
			name: this.progressOption.name as string,
			bar: this.progressRender(),
			percent: (this.percent * 100).toFixed(2),
			finish: this.finishedTask,
			total: this.allTask,
			...this.payload
		}
		cleanObject(dataRecord)

		// 使用声明的格式化输出
		return formatStringTemplate(this.progressOption.format as string, dataRecord)
	}
}
