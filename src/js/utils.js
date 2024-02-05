/* Track mouse position */
export function track(element) {
    const mouse = {
        x: 0,
        y: 0,
        event: null
    };

    element.addEventListener('mousemove', event => {
        const rect = element.getBoundingClientRect(); // Get the element's position relative to the viewport

        mouse.x = event.clientX - rect.left; // Use clientX to get the mouse position relative to the element
        mouse.y = event.clientY - rect.top; // Use clientY to get the mouse position relative to the element
        mouse.event = event;
    });

    return mouse;
};

function getElementTouch(element) {
    const touch = {
        x: null,
        y: null,
        isPressed: false,
        event: null,
    };

    const {
        body: {
            scrollLeft: bodyScrollLeft,
            scrollTop: bodyScrollTop,
        },
        documentElement: {
            scrollLeft: elementScrollLeft,
            scrollTop: elementScrollTop,
        }
    } = document;



    const handleTouchStart = (event) => {
        touch.isPressed = true;
        touch.event = event;
    };

    const handleTouchEnd = (event) => {
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
        touch.event = event;
    };

    const handleTouchMove = (event) => {
        const {
            offsetLeft,
            offsetTop
        } = element;

        const touchEvent = event.touches[0]; // first touch
        let x, y;
        if (touchEvent.pageX || touchEvent.pageY) {
            x = touchEvent.pageX;
            y = touchEvent.pageY;
        } else {
            x = touchEvent.clientX + bodyScrollLeft + elementScrollLeft;
            y = touchEvent.clientY + bodyScrollTop + elementScrollTop;
        }

        x -= offsetLeft;
        y -= offsetTop;

        touch.x = x;
        touch.y = y;
        touch.event = event;
    };


    element.addEventListener('touchstart', handleTouchStart, false);
    element.addEventListener('touchend', handleTouchEnd, false);
    element.addEventListener('touchmove', handleTouchMove, false);

    return touch;
};

export class Nonogram {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d")
        this.size = 0
        this.grid = []
        this.guesses = []
        this.hints = {
            rows: [],
            columns: []
        }
        this.mouse = getElementTouch(canvas)
    }

    generateGrid(size) {
        const grid = Array(size * size).fill(0)
        this.guesses = Array(size * size).fill(0)
        this.grid = grid.map(el => Math.round(Math.random()))
        this.size = size
        // PRINT FOR REVIEWS
        console.log(Array.from(
            {
                length: size,
            },
            (_, index) => this.grid.slice(index * size, (index + 1) * size)
        ))
    }

    clearGrid() {
        this.guesses = this.guesses.map(el => 0)
    }

    drawTile(x, y, color) {
        const gridStart = 100
        const tileSize = 60
        this.ctx.save();
        this.ctx.translate(gridStart, gridStart);
        this.ctx.fillStyle = color;//rgb(200,200,200);
        if (color === "red"){
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(x, y, tileSize, tileSize);
            this.ctx.fillStyle = color;
            this.ctx.translate(Math.round(tileSize/2), tileSize);
            this.ctx.textAlign = "center";
            this.ctx.font = "83px Arial";
            this.ctx.fillText('X', x, y);
        } else {
            this.ctx.fillRect(x, y, tileSize, tileSize);    
        }
        this.ctx.restore();
    }

    solve() {
        this.guesses = [...this.grid]
        this.update()
    }

    isSolved() {
        for (let i = 0; i < this.grid.length; i += 1) {
            if (this.grid[i] !== this.guesses[i]) return false
        }
        // this.grid.forEach((el, i) => {
        //     console.log(el !== this.guesses[i])
             
        // })
        return true
    }

    update() {
        this.ctx.clearRect(0,0,this.ctx.width, this.ctx.height)
        this.render()
        if (this.isSolved()) {
            alert ("Success!");
        }
    }


    onMouseDown(event) {
        const gridStart = 100
        const tileSize = 60
        // Проверяем положение мыши
        const updateGrid = () => {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const indexLoc = j + i * cols;
                    if (
                        mouse.x >= gridStart + (j * (tileSize + this.size)) &&
                        mouse.x <= gridStart + tileSize + j * (tileSize + this.size) &&
                        mouse.y >= gridStart + i * (tileSize + this.size) &&
                        mouse.y <= gridStart + tileSize + i * (tileSize + this.size)
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
        };

        updateGrid();

        this.update();
    }

    render() {
        const tileSize = 60, gridStart = 100
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(0, 0, this.ctx.width, this.ctx.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(gridStart - this.size, 
            gridStart - this.size, 
            (tileSize * this.size + this.size * (this.size + 1)), 
            (tileSize * this.size + this.size * (this.size + 1)));
        this.writeHorizClues();
        this.writeVertClues();
        
        for (var i = 0; i < this.size; i++){
            for (var j = 0; j < this.size; j++) {
                var indexLoc = j + i * this.size;
                
                if (this.guesses[indexLoc] === 0){
                    this.drawTile((tileSize + this.size) * j, (tileSize + this.size) * i ,"white");
                }else if (this.guesses[indexLoc] === 1){
                    this.drawTile((tileSize + this.size) * j, (tileSize + this.size) * i,"purple");
                }else {
                    this.drawTile((tileSize + this.size) * j, (tileSize + this.size) * i ,"red");
                }
            }
        }
    }

    writeHorizClues() {
        const tileSize = 60, gridStart = 100
        var x = 30;
        var y = gridStart + Math.round(tileSize/2);
        console.log(this.hints)

        if (this.hints.rows === null) {
            this.getHintsValues()
        }
        this.ctx.save();
        this.ctx.font = "bold 18px Arial";
        this.ctx.fillStyle = "white";
        
        for (var i = 0; i < this.hints.rows.length; i++){
            this.ctx.fillText(this.hints.rows[i], x, y); 
            y += tileSize + this.size;
        }
        this.ctx.restore();
    }


    writeVertClues() {
        const tileSize = 60, gridStart = 100
        var y;
        var x = gridStart + Math.round(tileSize/4);
                    
        this.ctx.save();
        this.ctx.font = "bold 18px Arial";
        this.ctx.fillStyle = "white";
        
        for (var i = 0; i < this.hints.columns.length; i++){
            var str = this.hints.columns[i];
            
            y = 32;
            for (var j = 0; j < str.length; ) {
                this.ctx.fillText(str.charAt(j), x, y); 
                j++;
                if (str.charAt(j) === ' '){
                    y += 28;
                    while (str.charAt(j) === ' '){
                        j++;
                    }
                }
            }
            
            x += tileSize + this.size;
        }
        this.ctx.restore();
    }

    getHintsValues() {
        for (var i = 0; i < this.size; i++){
            let row = ''
            let cnt = 0, indexLoc = 0
            indexLoc = i * this.size;
            for (var j = 1; j < this.size - 1; j++){
                cnt = 0;
                
                while (this.grid[indexLoc] === 0 && indexLoc < (this.size + i * this.size)){
                    indexLoc++;
                }
                while (this.grid[indexLoc] === 1 && indexLoc < (this.size + i * this.size)){
                    cnt += 1;
                    indexLoc++;
                } 
                if (cnt) {
                   row += cnt + '  ';  
                }
                if (indexLoc >= (this.size + i * this.size)){
                    break;
                }
            }
            if (row === '') {
                row = '0';
            }
            this.hints.rows.push(row);               
        }
        
        for (var i = 0; i < this.size; i++){
            let cnt = 0, indexLoc = i, col = ''
            for (var j = 1; j < 4; j++){
                cnt = 0;
                
                while (this.grid[indexLoc] === 0 && indexLoc < (i + this.size * this.size)){
                    indexLoc += this.size;
                }
                while (this.grid[indexLoc] === 1 && indexLoc < (i + this.size * this.size)){
                    cnt += 1;
                    indexLoc += this.size;
                } 
                if (cnt) {
                   col += cnt + '  ';  
                }
                if (indexLoc >= (i + this.size * this.size)){
                    break;
                }
            }
            if (col === '') {
                col = '0';
            }
            this.hints.columns.push(col);               
        }

        console.log(this.hints)
    }
}