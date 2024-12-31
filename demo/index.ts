import { SingleLine } from '../src'
import chalk from 'chalk'

const singleLine = new SingleLine({
	name: 'Test',
	leftColor: '#39c5bb',
	// rightColor: '#7b5d5d',
	format: `${chalk.red('{name}')} | {bar} | ${chalk.yellow('{percent}% Percent')} | ${chalk.green('{finish}/{total} Chunks')}`
})
singleLine.start(100, 0)
setTimeout(() => {
	singleLine.update(50)
}, 1000)

setTimeout(() => {
	singleLine.update(100)
}, 2000)
