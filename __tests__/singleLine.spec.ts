import { SingleLine } from '../src'
import chalk from 'chalk'

describe('SingleLine output test', () => {
	it('BaseLine output', () => {
		const singleLine = new SingleLine()
		singleLine.start(100)
		expect(singleLine.progressRender()).toBe(''.padEnd(50, '░'))

		singleLine.update(50)
		expect(singleLine.progressRender()).toBe(''.padEnd(25, '█').padEnd(50, '░'))

		singleLine.update(100)
		expect(singleLine.isFinished).toBe(true)
	})

	it('BaseLine output with custom char', () => {
		const singleLine = new SingleLine({
			leftChar: '+',
			rightChar: '-'
		})

		singleLine.start(100)
		expect(singleLine.progressRender()).toBe('-'.repeat(50))

		singleLine.update(50)
		expect(singleLine.progressRender()).toBe(chalk.green('+').repeat(25) + '-'.repeat(25))

		singleLine.update(100)
		expect(singleLine.progressRender()).toBe(chalk.green('+').repeat(50))
	})

	it('SingleLine output with info.', () => {
		const singleLineAllShow = new SingleLine({
			name: 'singleLine',
			showPercent: true,
			showTask: true
		})

		singleLineAllShow.start(100)
		expect(singleLineAllShow.render()).toBe(`singleLine | ${'░'.repeat(50)} | 0/100 | 0.00%`)

		const singleLineNoInfo = new SingleLine({
			showPercent: false,
			showTask: false
		})

		singleLineNoInfo.start(100)
		expect(singleLineNoInfo.render()).toBe(`${'░'.repeat(50)}`)
	})

	it('More tasks completed than all tasks.', () => {
		expect(() => new SingleLine().start(100).update(101)).toThrow(RangeError)
	})
})
