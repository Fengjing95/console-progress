import { MultiLine } from '../src'

const multiLine = new MultiLine()
const line1 = multiLine.create(100, 0, { name: 'line1' })
const line2 = multiLine.create(100, 0, { name: 'line2' })

const timer = setInterval(() => {
	const index = Math.floor(Math.random() * 2)
	const line = index === 0 ? line1 : line2
	if (line.isFinished()) {
		return
	}

	line.increment(5)

	if (line1.isFinished() && line2.isFinished()) {
		clearInterval(timer)
	}
}, 50)
