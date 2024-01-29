let dim = 5
const canvas = document.createElement('canvas'),
	body = document.querySelector('body'),
	ctx = canvas.getContext("2d"),
	rectangle = new Path2D(),
	cellSize = 30,
	cellsLine = cellSize * dim,
	cellsColumn = cellsLine * dim,
	screenD = (grid) => grid.length * cellSize

ctx.strokeStyle = "black"
ctx.lineWidth = 2
// ctx.strokeRect(10, 10, 100, 100)
canvas.textContent = 'Извините, ваш браузер не поддерживает "canvas" элемент.'

const grid = buildGrid()
canvas.width = screenD(grid)
canvas.height = screenD(grid)
ctx.strokeRect(0, 0, canvas.width, canvas.height)
paintCells(grid, screenD(grid))

body.appendChild(canvas)
const offsetX = canvas.offsetLeft, offsetY = canvas.offsetTop

canvas.addEventListener('mousedown', handleMouseDown)
canvas.addEventListener('mouseup', handleMouseUp)
canvas.addEventListener('mouseout', handleMouseOut)

function buildGrid() {
	const lines = Array(dim).fill(0)
	const grid = Array(dim).fill(lines)
	return grid
}

function paintCells(grid, len) {
	grid.forEach((el, i) => { // rows
		renderLine(0, i * cellSize, len, i * cellSize, "#1F1F1F", 1)
	})

	grid.forEach((el, i) => { // columns
		renderLine(i * cellSize, 0, i * cellSize, len, "#1F1F1F", 1)
	})
}

function renderLine(startx, starty, endx, endy, color, line_width) {
	ctx.strokeStyle = color;
	ctx.lineWidth = line_width;
	ctx.beginPath();
	ctx.moveTo(startx, starty);
	ctx.lineTo(endx, endy);
	ctx.stroke();
}

function handleMouseDown(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
}

// set the ending X/Y of the drag on mouseup
function handleMouseUp(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // set the ending X/Y
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    // done with the drag
    isDown = false;
    console.log(startX, startY)
}
// cancel the drag if the mouse exits the canvas
function handleMouseOut(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // moved out of the canvas, stop the drag
    isDown = false;
	console.log(startX, startY)
}
