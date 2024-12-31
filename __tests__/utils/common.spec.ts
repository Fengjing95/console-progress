import { expect, it, describe } from 'vitest'
import { cleanObject, isHEX } from '../../src/utils'

describe('common util', () => {
	it('cleanObject', () => {
		const obj = {
			a: 1,
			b: 2,
			c: undefined
		}
		expect(Object.keys(obj)).toEqual(['a', 'b', 'c'])
		cleanObject(obj)
		expect(Object.keys(obj)).toEqual(['a', 'b'])
	})

	it('isHEX', () => {
		expect(isHEX('#ffffff')).toBe(true)
		expect(isHEX('#fff')).toBe(true)
		expect(isHEX('#fffffg')).toBe(false)
		expect(isHEX('#fffff')).toBe(false)
		expect(isHEX('#fffffff')).toBe(false)
	})
})
