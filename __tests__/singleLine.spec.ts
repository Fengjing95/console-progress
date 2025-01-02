import { SingleLine } from '../src'
import chalk from 'chalk'
import { expect, it, describe } from 'vitest'

describe('SingleLine output test', () => {
	it('BaseLine output', () => {
		const singleLine = new SingleLine({
			log: false
		})
		singleLine.start(100)
		expect(singleLine.render()).toBe(`${'░'.repeat(50)} | 0.00% Percent | 0/100 Chunks`)
		expect(singleLine.getAllTaskCount()).toBe(100)
		expect(singleLine.getFinishedTaskCount()).toBe(0)

		singleLine.update(50)
		expect(singleLine.render()).toBe(
			`${chalk.green('█').repeat(25)}${'░'.repeat(25)} | 50.00% Percent | 50/100 Chunks`
		)
		expect(singleLine.getAllTaskCount()).toBe(100)
		expect(singleLine.getFinishedTaskCount()).toBe(50)

		expect(singleLine.isFinished()).toBe(false)

		singleLine.update(100)
		expect(singleLine.isFinished()).toBe(true)
	})

	it('BaseLine output with custom char', () => {
		const singleLine = new SingleLine({
			leftChar: '+',
			rightChar: '-',
			log: false
		})

		singleLine.start(100)
		expect(singleLine.render()).toBe(`${'-'.repeat(50)} | 0.00% Percent | 0/100 Chunks`)

		singleLine.update(50)
		expect(singleLine.render()).toBe(
			`${chalk.green('+').repeat(25)}${'-'.repeat(25)} | 50.00% Percent | 50/100 Chunks`
		)

		singleLine.update(100)
		expect(singleLine.render()).toBe(
			`${chalk.green('+').repeat(50)} | 100.00% Percent | 100/100 Chunks`
		)
	})

	it('More tasks completed than all tasks.', () => {
		const line = new SingleLine({
			log: false
		})
		line.start(100)
		expect(() => line.update(101)).toThrow(RangeError)
		line.stop()
	})

	it('custom output format without name', () => {
		const formatLine = new SingleLine({
			format: '{name} | {bar} | Finished {percent}% | {finish}/{total} Chunks | {foo}'
		})
		formatLine.start(100, 0, { foo: 'bar' })
		expect(formatLine.render()).toBe(
			`{name} | ${'░'.repeat(50)} | Finished 0.00% | 0/100 Chunks | bar`
		)

		formatLine.update(50, { foo: 'baz' })
		expect(formatLine.render()).toBe(
			`{name} | ${chalk.green('█').repeat(25)}${'░'.repeat(25)} | Finished 50.00% | 50/100 Chunks | baz`
		)
		formatLine.stop()
	})

	it('custom output format with name', () => {
		const formatLine = new SingleLine({
			name: 'customFormat',
			format: '{name} | {bar} | {percent}% Percent | {finish}/{total} Chunks',
			log: false
		})
		formatLine.start(200)
		expect(formatLine.render()).toBe(
			`customFormat | ${'░'.repeat(50)} | 0.00% Percent | 0/200 Chunks`
		)

		expect(formatLine.name).toBe('customFormat')

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
			rightColor: '#00ff00',
			log: false
		})

		colorLine.start(100)
		expect(colorLine.render()).toBe(`${chalk.green('-').repeat(50)} | 0.00% Percent | 0/100 Chunks`)

		colorLine.update(50)
		expect(colorLine.render()).toBe(
			`${chalk.red('+').repeat(25)}${chalk.green('-').repeat(25)} | 50.00% Percent | 50/100 Chunks`
		)

		colorLine.stop()
	})

	it("custom char's color error", () => {
		expect(() => new SingleLine({ leftColor: '#ff00000' })).toThrow(TypeError)
		expect(() => new SingleLine({ leftColor: '#ff000' })).toThrow(TypeError)
		expect(() => new SingleLine({ leftColor: '#ff000g' })).toThrow(TypeError)
	})

	it('increment', () => {
		const incrementLine = new SingleLine({ log: false })

		incrementLine.start(100)
		expect(incrementLine.render()).toBe(`${'░'.repeat(50)} | 0.00% Percent | 0/100 Chunks`)

		incrementLine.increment(2)
		expect(incrementLine.getFinishedTaskCount()).toBe(2)
		expect(incrementLine.render()).toBe(
			`${chalk.green('█').repeat(1)}${'░'.repeat(49)} | 2.00% Percent | 2/100 Chunks`
		)
	})
})
