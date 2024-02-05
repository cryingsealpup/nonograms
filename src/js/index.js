import { Nonogram } from "./utils"


window.addEventListener('contextmenu', e => { e.preventDefault() }, false) // do not show context menu on RMC

let dim = 5
const canvas = document.createElement('canvas'),
	body = document.querySelector('body'),
	reset = document.createElement('button'),
	solve = document.createElement('button')

canvas.width = canvas.height = '470'
canvas.textContent = 'Извините, ваш браузер не поддерживает "canvas" элемент.'
reset.textContent = 'Reset'
solve.textContent = 'Solve'
body.append(canvas, reset, solve)

const nonogram = new Nonogram(canvas, dim)
nonogram.play()

solve.addEventListener('click', () => { nonogram.solve() })
reset.addEventListener('click', () => { nonogram.reset(true) })

