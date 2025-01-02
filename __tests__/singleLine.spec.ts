import { SingleLine } from '../src'
import chalk from 'chalk'
import { expect, it, describe } from 'vitest'

describe('SingleLine output test', () => {
	it('BaseLine output', () => {
		const singleLine = new SingleLine()
		singleLine.start(100)
		expect(singleLine.progressRender()).toBe(''.padEnd(50, '░'))
		expect(singleLine.getAllTaskCount()).toBe(100)
		expect(singleLine.getFinishedTaskCount()).toBe(0)

		singleLine.update(50)
		expect(singleLine.progressRender()).toBe(''.padEnd(25, '█').padEnd(50, '░'))
		expect(singleLine.getAllTaskCount()).toBe(100)
		expect(singleLine.getFinishedTaskCount()).toBe(50)

		expect(singleLine.isFinished()).toBe(false)

		singleLine.update(100)
		expect(singleLine.isFinished()).toBe(true)
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
		expect(singleLineAllShow.render()).toBe(
			`singleLine | ${'░'.repeat(50)} | 0/100 Chunks | 0.00% Percent`
		)
		singleLineAllShow.stop()

		const singleLineNoInfo = new SingleLine({
			showPercent: false,
			showTask: false
		})

		singleLineNoInfo.start(100)
		expect(singleLineNoInfo.render()).toBe(`${'░'.repeat(50)}`)
		singleLineNoInfo.stop()
	})

	it('More tasks completed than all tasks.', () => {
		const line = new SingleLine()
		expect(() => line.start(100).update(101)).toThrow(RangeError)
		line.stop()
	})

	it('custom output format without name', () => {
		const formatLine = new SingleLine({
			format: '{name} | {bar} | Finished {percent}% | {finish}/{total} Chunks | {foo}'
		})
		formatLine.start(100, 0, { foo: 'bar' })
		expect(formatLine.render({ foo: 'bar' })).toBe(
			`{name} | ${'░'.repeat(50)} | Finished 0.00% | 0/100 Chunks | bar`
		)

		formatLine.update(50, { foo: 'bar' })
		expect(formatLine.render({ foo: 'bar' })).toBe(
			`{name} | ${chalk.green('█').repeat(25)}${'░'.repeat(25)} | Finished 50.00% | 50/100 Chunks | bar`
		)
		formatLine.stop()
	})

	it('custom output format with name', () => {
		const formatLine = new SingleLine({
			name: 'customFormat',
			format: '{name} | {bar} | {percent}% Percent | {finish}/{total} Chunks'
		})
		formatLine.start(200)
		expect(formatLine.render()).toBe(
			`customFormat | ${'░'.repeat(50)} | 0.00% Percent | 0/200 Chunks`
		)

		formatLine.update(100)
		expect(formatLine.render()).toBe(
			`customFormat | ${chalk.green('█').repeat(25)}${'░'.repeat(25)} | 50.00% Percent | 100/200 Chunks`
		)
		formatLine.stop()
	})

	it("custom char's color", () => {
		const colorLine = new SingleLine({
			leftChar: '+',
			leftColor: '#ff0000',
			rightChar: '-',
			rightColor: '#00ff00'
		})

		colorLine.start(100)
		expect(colorLine.progressRender()).toBe(chalk.red('-').repeat(50))

		colorLine.update(50)
		expect(colorLine.progressRender()).toBe(chalk.red('+').repeat(25) + chalk.green('-').repeat(25))
		colorLine.stop()
	})

	it("custom char's color error", () => {
		expect(() => new SingleLine({ leftColor: '#ff00000' })).toThrow(TypeError)
		expect(() => new SingleLine({ leftColor: '#ff000' })).toThrow(TypeError)
		expect(() => new SingleLine({ leftColor: '#ff000g' })).toThrow(TypeError)
	})

	it('increment', () => {
		const incrementLine = new SingleLine()

		incrementLine.start(100)
		expect(incrementLine.progressRender()).toBe('░'.repeat(50))

		incrementLine.increment(2)
		expect(incrementLine.getFinishedTaskCount()).toBe(2)
		expect(incrementLine.progressRender()).toBe(chalk.green('█') + '░'.repeat(49))
	})
})
