import { MultiLine } from '../src'
import chalk from 'chalk'
import { expect, it, describe } from 'vitest'

describe('multiLine output test', () => {
	it('multiLine base output', () => {
		const multiLine = new MultiLine({
			log: false
		})
		const line1 = multiLine.create(100, 0, { name: 'test' })
		const line2 = multiLine.create(100, 0, { name: 'test2' })

		expect(multiLine.getLines().length).toBe(2)
		expect(multiLine.render()).toBe(
			`test | ${'░'.repeat(50)} | 0.00% Percent | 0/100 Chunks\ntest2 | ${'░'.repeat(50)} | 0.00% Percent | 0/100 Chunks`
		)

		line1.update(50)
		line2.update(80)
		expect(multiLine.render()).toBe(
			`test | ${chalk.green('█').repeat(25)}${'░'.repeat(25)} | 50.00% Percent | 50/100 Chunks\ntest2 | ${chalk
				.green('█')
				.repeat(40)}${'░'.repeat(10)} | 80.00% Percent | 80/100 Chunks`
		)

		line1.increment(2)
		expect(multiLine.render()).toBe(
			`test | ${chalk.green('█').repeat(26)}${'░'.repeat(24)} | 52.00% Percent | 52/100 Chunks\ntest2 | ${chalk
				.green('█')
				.repeat(40)}${'░'.repeat(10)} | 80.00% Percent | 80/100 Chunks`
		)

		line1.update(100)
		line2.update(100)
	})

	it('range error', () => {
		const multiLine = new MultiLine()
		const line = multiLine.create(100, 0, { name: 'test' })
		line.update(80)
		expect(() => line.increment(21)).toThrow(RangeError)
	})

	it('index over', () => {
		const multiLine = new MultiLine({ log: false })

		multiLine.create(100, 0, { name: 'test' })

		expect(() => multiLine.update(1, 50)).toThrow(RangeError)

		multiLine.stop()
	})
})
