import { BaseLine, PayloadType, ProgressOption } from './baseLine'
import ansiEscapes from 'ansi-escapes'
import * as process from 'node:process'
import { EOL } from 'node:os'

export interface LineOption extends ProgressOption {
	hideCursor?: boolean // 隐藏光标
	log?: boolean // 输出到控制台
}

const defaultLineOption: LineOption = {
	hideCursor: true,
	log: true
}

export class SingleLine extends BaseLine {
	private readonly lineOption: LineOption

	constructor(option?: LineOption) {
		super(option)
		this.lineOption = {
			...defaultLineOption,
			...option
		}
		// 光标控制
		if (this.lineOption.hideCursor) {
			this.write(ansiEscapes.cursorHide)
		}
		this.write(ansiEscapes.cursorSavePosition)
	}

	private write(...chunks: Parameters<typeof process.stdout.write>) {
		if (!this.lineOption.log) {
			return
		}
		process.stdout.write.call(process.stdout, ...chunks)
	}

	/**
	 * 输出进度条
	 * @protected
	 */
	protected log() {
		this.write(ansiEscapes.cursorRestorePosition)
		this.write(this.render())
	}

	/**
	 * 初始化进度条任务数量
	 * @param total 全部的任务数量
	 * @param current 开始时的任务数量，默认为 0
	 * @param data 渲染进度条时需要渲染的数据
	 */
	start(total: number, current: number = 0, data?: PayloadType) {
		// 光标控制
		if (this.lineOption.hideCursor) {
			this.write(ansiEscapes.cursorHide)
		}
		this.write(ansiEscapes.cursorSavePosition)

		// 更新状态
		super.start(total, current, data)
		// 打印
		this.log()
	}

	/**
	 * 更新完成的任务数量
	 * @param current 已完成任务数量
	 * @param data 渲染进度条时需要渲染的数据
	 */
	update(current: number, data?: PayloadType) {
		// 更新状态
		super.update(current, data)
		// 打印
		this.log()

		if (current === this.allTask) {
			// 完成
			this.stop()
		}
	}

	/**
	 * 步进任务数量
	 * @param step 步进数量
	 * @param data 渲染进度条需要的额外数量
	 */
	increment(step = 1, data?: PayloadType) {
		super.increment(step, data)
		this.log()
	}

	/**
	 * 停止进度条
	 */
	stop() {
		this.write(ansiEscapes.cursorShow)
		this.write(EOL)
	}
}
