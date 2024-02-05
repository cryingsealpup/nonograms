function getElementTouch(element) {
    const mouse = {
        x: 0,
        y: 0,
        event: null
    };

    element.addEventListener('mousemove', (event) => {
        const rect = element.getBoundingClientRect();
        const {
            clientX,
            clientY
        } = event;

        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.event = event;
    });

    return mouse;
}

export class Nonogram {
    constructor(canvas, size) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.size = size
        this.answer = []
        this.guesses = []
        this.hints = {
            rows: [],
            columns: []
        };
        this.marginGrid = 0
        this.dividerWidth = 0
        this.mouse = getElementTouch(canvas)

        canvas.addEventListener('mousedown', (event) => {
            this.onMouseDown(event)
            this.update()
        }, false)
    }

    play() {
        this.generateGrid();
        this.getHintsValues();
        this.reset();
        this.update();
    }

    generateGrid() {
        const cells = Array(this.size * this.size).fill(0);
        this.guesses = Array(this.size * this.size).fill(0);
        this.answer = cells.map((cell) => Math.round(Math.random()));
        this.marginGrid = 100;
        this.dividerWidth = Math.trunc((this.canvas.width - this.marginGrid - 30) / this.size);
        // PRINT FOR REVIEWS
        console.log(Array.from({
                length: this.size,
            },
            (_, index) => this.answer.slice(index * this.size, (index + 1) * this.size)
        ))
    }

    reset(flag = false) {
        this.guesses = this.guesses.map(() => 0);
        if (flag) this.update();
    }

    drawCell(x, y, color) {
        this.ctx.save();
        this.ctx.translate(this.marginGrid, this.marginGrid);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.dividerWidth, this.dividerWidth);
        this.ctx.restore();
    }

    solve() {
        this.guesses = [...this.answer];
        this.update();
    }

    isSolved() {
        return this.answer.every((cell, index) => cell === this.guesses[index]);
    }

    update() {
        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        this.render();

        if (this.isSolved()) {
            window.setTimeout(() => {
                alert('Success!');
                this.play();
            }, 500);
        }
    }

    onMouseDown() {
        for (let i = 0; i < this.size; i += 1) {
            for (let j = 0; j < this.size; j += 1) {
                const indexLoc = j + i * this.size;
                const cellX = this.marginGrid + j * (this.dividerWidth + this.size);
                const cellY = this.marginGrid + i * (this.dividerWidth + this.size);

                if (
                    this.mouse.x >= cellX &&
                    this.mouse.x <= cellX + this.dividerWidth &&
                    this.mouse.y >= cellY &&
                    this.mouse.y <= cellY + this.dividerWidth
                ) {
                    switch (event.button) {
                        case 0:
                            this.guesses[indexLoc] = this.guesses[indexLoc] === 1 ? 0 : 1;
                            break;
                        case 2:
                            this.guesses[indexLoc] = this.guesses[indexLoc] === 2 ? 0 : 2;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    render() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(
            this.marginGrid - this.size,
            this.marginGrid - this.size,
            (this.dividerWidth * this.size + this.size * (this.size + 1)),
            (this.dividerWidth * this.size + this.size * (this.size + 1))
        );
        this.writeHorizClues();
        this.writeVertClues();

        for (let i = 0; i < this.size; i += 1) {
            for (let j = 0; j < this.size; j += 1) {
                const indexLoc = j + i * this.size;
                const cellX = (this.dividerWidth + this.size) * j;
                const cellY = (this.dividerWidth + this.size) * i;

                if (this.guesses[indexLoc] === 0) {
                    this.drawCell(cellX, cellY, 'white');
                } else {
                    this.drawCell(cellX, cellY, 'black');
                }
            }
        }
    }

    writeHorizClues() {
        const x = 30;
        let y = this.marginGrid + Math.round(this.dividerWidth / 2);

        if (this.hints.rows === null) {
            this.getHintsValues();
        }
        this.ctx.save();
        this.ctx.font = 'bold 12px Arial';


        for (let i = 0; i < this.hints.rows.length; i += 1) {
            this.ctx.fillText(this.hints.rows[i], x, y);
            y += this.dividerWidth + this.size;
        }
        this.ctx.fillStyle = 'black';
        this.ctx.restore();
    }

    writeVertClues() {
        let y;
        let x = this.marginGrid + Math.round(this.dividerWidth / 4);

        this.ctx.save();
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = 'black';

        for (let i = 0; i < this.hints.columns.length; i += 1) {
            const str = this.hints.columns[i];
            y = 12

            for (let j = 0; j < str.length; j += 1) {
                y += 10
                this.ctx.fillText(str.charAt(j), x, y)
            }

            x += this.dividerWidth + this.size
        }

        this.ctx.restore()
    }

    getHintsValues() {
        this.hints = {
            rows: [],
            columns: []
        };

        for (let i = 0; i < this.size; i += 1) {
            let row = '';
            let cnt = 0;
            let indexLoc = i * this.size;
            for (let j = 1; j < this.size - 1; j += 1) {
                cnt = 0;

                while (this.answer[indexLoc] === 0 && indexLoc < (this.size + i * this.size)) {
                    indexLoc++
                }

                while (this.answer[indexLoc] === 1 && indexLoc < (this.size + i * this.size)) {
                    cnt += 1
                    indexLoc++
                }

                if (cnt) {
                    row += `${cnt}  `
                }

                if (indexLoc >= (this.size + i * this.size)) {
                    break
                }
            }

            if (row === '') row = '0'

            this.hints.rows.push(row)
        }

        for (let i = 0; i < this.size; i += 1) {
            let cnt = 0
            let indexLoc = i
            let col = ''

            for (let j = 1; j < 4; j += 1) {
                cnt = 0;

                while (this.answer[indexLoc] === 0 && indexLoc < (i + this.size * this.size)) {
                    indexLoc += this.size;
                }

                while (this.answer[indexLoc] === 1 && indexLoc < (i + this.size * this.size)) {
                    cnt += 1;
                    indexLoc += this.size;
                }

                if (cnt) {
                    col += `${cnt}  `;
                }

                if (indexLoc >= (i + this.size * this.size)) {
                    break;
                }
            }

            if (col === '') {
                col = '0';
            }

            this.hints.columns.push(col);
        }
    }
}