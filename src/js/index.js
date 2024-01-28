const canvas = document.createElement('canvas'),
    body = document.querySelector('body'),
    ctx = canvas.getContext("2d"),
    rectangle = new Path2D()

let frameSize = 5

rectangle.rect(10, 10, 100, 100)

ctx.strokeStyle = "black"
ctx.lineWidth = 2
ctx.strokeRect(10, 10, 100, 100)
canvas.textContent = 'Извините, ваш браузер нет поддерживает "canvas" элемент.'
console.log(ctx)
body.appendChild(canvas)

