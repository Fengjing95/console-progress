import { expect, it, describe } from 'vitest'
import { formatStringTemplate } from '../../src/utils'

describe('stringTemplate', () => {
	it('formatStringTemplate', () => {
		expect(formatStringTemplate('{name} is {age} years old.', { name: 'John', age: 30 })).toBe(
			'John is 30 years old.'
		)

		expect(formatStringTemplate('{name} is {age} years old.', { name: 'John' })).toBe(
			'John is {age} years old.'
		)
	})
})
