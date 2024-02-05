import { Nonogram } from "./utils"


window.addEventListener('contextmenu', e => { e.preventDefault() }, false) // do not show context menu on RMC

let dim = 5
const canvas = document.createElement('canvas'),
	wrapper = document.createElement('div'),
	buttonWrapper = document.createElement('div'),
	body = document.querySelector('body'),
	reset = document.createElement('button'),
	solve = document.createElement('button')


canvas.width = canvas.height = window.innerWidth > 700 ? '470' : window.innerWidth
window.addEventListener('resize', () => { location.reload() }) // Reload on resize to fit content
canvas.textContent = 'Извините, ваш браузер не поддерживает "canvas" элемент.'
reset.textContent = 'Reset'
solve.textContent = 'Solve'
wrapper.classList.add('wrapper')
buttonWrapper.classList.add('button-wrapper')
buttonWrapper.append(reset, solve)
wrapper.append(canvas, buttonWrapper)
body.append(wrapper)

const nonogram = new Nonogram(canvas, dim)
nonogram.play()

solve.addEventListener('click', () => { nonogram.solve() })
reset.addEventListener('click', () => { nonogram.reset(true) })

