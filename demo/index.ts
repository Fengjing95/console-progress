import { SingleLine } from '../src'

const singleLine = new SingleLine({
	name: 'download book'
})
singleLine.start(100, 0)
setTimeout(() => {
	singleLine.update(50)
}, 1000)

setTimeout(() => {
	singleLine.update(100)
}, 2000)
