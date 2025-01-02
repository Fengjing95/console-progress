import { SingleLine } from '../src'
import chalk from 'chalk'

const singleLine = new SingleLine({
	name: 'Test',
	leftColor: '#39c5bb',
	format: `${chalk.red('{name}')} | {bar} | ${chalk.yellow('{percent}% Percent')} | ${chalk.green('{finish}/{total} Chunks')}`
})
singleLine.start(100, 0)

setTimeout(() => {
	singleLine.update(30)

	const timer = setInterval(() => {
		singleLine.increment()
		if (singleLine.isFinished()) {
			clearInterval(timer)
		}
	}, 100)
}, 1000)
