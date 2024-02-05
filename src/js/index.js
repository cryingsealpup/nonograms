import { Nonogram } from "./utils"


window.addEventListener('contextmenu', e => { e.preventDefault() }, false) // do not show context menu on RMC

let dim = 5 
const canvas = document.createElement('canvas'),
	body = document.querySelector('body'),
	ctx = canvas.getContext("2d")

ctx.strokeStyle = "black"
ctx.lineWidth = 2
canvas.width = canvas.height = '450'
canvas.textContent = 'Извините, ваш браузер не поддерживает "canvas" элемент.'
body.appendChild(canvas)

const grid = new Nonogram(canvas)
grid.generateGrid(dim)
grid.getHintsValues()
grid.clearGrid()
grid.update()
console.log(grid.hints)
