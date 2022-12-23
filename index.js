// import { binarySearchIndex, factorNumber, findPrimeFactorisation, getLowestCommonMultiple, isPrime, mergeArrays, sortArray } from "./functions.js";
import { getKickOffsets, getMinoLocations } from "./piece_info.js";
const canvas = document.getElementById("gameCanvas");  // code from https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Create_the_Canvas_and_draw_on_it
const ctx = canvas.getContext("2d");

// use export thing later
// const red = "#ff4020"
// const orange = "#ff8020"
// const yellow = "#ffe020"
// const green = "#40d040"
// const cyan = "#00d0ff"
// const blue = "#4080ff"
// const purple = "#a040f0"
// const grey = "#bbbbbb"
// const black = "#000000"


// dark, light, main
const red_3d = ["#cf3319", "#ff6950", "#ff4020"]
const orange_3d = ["#da6d1b", "#ff9c51", "#ff8020"]
const yellow_3d = ["#dcc11c", "#ffec73", "#ffe020"]
const green_3d = ["#34ae34", "#73d173", "#40d040"]
const cyan_3d = ["#00afd8", "#5ee1ff", "#00d0ff"]
const blue_3d = ["#3060c0", "#6397ff", "#4080ff"]
const purple_3d = ["#8332c7", "#b161f4", "#a040f0"]
const grey_3d = ["#9a9a9a", "#cbcbcb", "#000000"] // "#bbbbbb" last value for filled-in ghost block
const black_3d = ["#000000", "#181818", "#000000"]

const pieceToColour = {
    "_":black_3d,
    "T":purple_3d,
    "I":cyan_3d,
    "L":orange_3d,
    "J":blue_3d,
    "S":green_3d,
    "Z":red_3d,
    "O":yellow_3d,
    "X":grey_3d
}

function shuffleArray(arr) {  // code from https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
    arr.sort(() => Math.random() - 0.5);
}


class gameBoard {
    constructor(rows, columns, previews) {
        this.rows = rows;  // 20 high board should have 22 rows for piece spawn location
        this.columns = columns;
        this.previews = previews;
        this.minoSize = 25  // pixels per mino (square)
        this.leftXvalue = 125

        this.pieceQueue = ["X"];
        this.pieceCoords;
        this.pieceBag = ["T", "I", "L", "J", "S", "Z", "O"];
        this.pieceOrientation = 0;
        this.heldPiece = ""

        this.board = new Array(this.rows);
        
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = new Array(this.columns).fill("_");
        }
        this.resetPieceState();
    }
    
    // graphics

    drawSquare(leftXvalue, topYvalue, squareSize, colour) {
        ctx.beginPath();
        ctx.rect(leftXvalue, topYvalue, squareSize, squareSize);
        ctx.fillStyle = colour
        ctx.fill()
        ctx.closePath();
    }

    draw3Dmino(coords, piece) {
        let sizeOffset;
        let positionOffset;
        let pixelPadding = 3;
        for (let colourLayer = 0; colourLayer <= 2; colourLayer++) {
            sizeOffset = colourLayer*pixelPadding
            positionOffset = (colourLayer === 2) ? pixelPadding : 0;
            this.drawSquare(coords[0]+positionOffset, coords[1]+positionOffset, 
                this.minoSize-sizeOffset, pieceToColour[piece][colourLayer])
        }
    }

    drawNonBoardPiece(coords, piece, orientation) {
        let pieceToDraw = (piece === "X") ? this.pieceQueue[0] : piece
        let minoOffsets = getMinoLocations(pieceToDraw, orientation)
        for (let minoOffset of minoOffsets) {
            const minoXY = [
                (minoOffset[0]*this.minoSize)+coords[0],
                (-minoOffset[1]*this.minoSize)+coords[1]
            ]
            this.draw3Dmino(minoXY, piece)
        }
    }

    drawBoard(leftXvalue) {
        // draw board from this.board array
        for (let rowNum = 0; rowNum < this.rows; rowNum++) {
            const minoYValue = rowNum*this.minoSize
            for (let colNum = 0; colNum < this.columns; colNum++) {
                const minoXValue = colNum*this.minoSize+leftXvalue
                // background tiles above board are not textured but drawn as black
                if (rowNum <= 2 && this.board[rowNum][colNum] === "_") {
                    // draw tiles above the proper board
                    this.drawSquare(minoXValue, minoYValue, this.minoSize, "#000000")
                } else {
                    // draw the actual board
                    this.draw3Dmino([minoXValue, minoYValue],this.board[rowNum][colNum])
                }
            }
        }

        // ghost piece
        const ghostPieceXY = [
            leftXvalue+((this.pieceCoords[0]-1)*this.minoSize),
            (this.rows-this.findBottom()[1])*this.minoSize
        ]
        this.drawNonBoardPiece(ghostPieceXY, "X", this.pieceOrientation)
        
        // active piece is not in the board array so it must be drawn separately
        const activePieceXY = [
            leftXvalue+((this.pieceCoords[0]-1)*this.minoSize),
            (this.rows-this.pieceCoords[1])*this.minoSize
        ]
        this.drawNonBoardPiece(activePieceXY, this.pieceQueue[0], this.pieceOrientation)
        // this.drawNonBoardPiece(this.pieceCoords, this.pieceQueue[0], this.pieceOrientation)

        // held piece
        if (this.heldPiece !== "") {
            const offset = this.getPieceOffsets(this.heldPiece)
            this.drawNonBoardPiece([25-offset[0],75-offset[1]], this.heldPiece, 0)
        }

        // next piece previews
        for (let i = 1; i <= this.previews; i++) {
            const offset = this.getPieceOffsets(this.pieceQueue[i])
            this.drawNonBoardPiece([400-offset[0],(i*75)-offset[1]], this.pieceQueue[i], 0)
        }

    }

    getPieceOffsets(piece) { // for drawing hold and next queues
        return [
            (piece === "O" || piece === "I") ? 12 : 0,
            (piece === "I") ? 12 : 0
        ]
    }

    
    // board manipulation
    coordsToIndex(coords) {
        return [this.rows - coords[1],coords[0]-1]
    }

    placeTetromino(coords, piece, orientation) {
        let minoOffsets = getMinoLocations(piece, orientation)
        for (let mino of minoOffsets) {
            let minoCoords = mino.map((offset,index) => offset+coords[index])
            this.placeMino(minoCoords, piece)
        }
    }

    placeMino(coords, piece) {
        // must convert coords to index
        this.board[this.rows - coords[1]][coords[0] - 1] = piece;
    }

    validPlacement(coords, piece, orientation) {
        let minoOffsets = getMinoLocations(piece, orientation)
        let validity = true
        for (let mino of minoOffsets) {  // i want to use array.every() here but callbacks are confusing me 
            let minoCoords = mino.map((offset,index) => offset+coords[index])
            if (minoCoords[1] <= 0 || minoCoords[1] >= 24) {
                validity = false
                break;
            }
            if (this.board[this.rows - minoCoords[1]][minoCoords[0] - 1] !== "_") {
                validity = false
                break;
            }
        }
        return validity;
    }

    translatePiece(vector) {
        let newCoords = this.pieceCoords.map((coord, index) => coord+vector[index])
        if (this.validPlacement(newCoords, this.pieceQueue[0], this.pieceOrientation)) {
            this.pieceCoords = newCoords
        // } else {
        //     console.log(`attempted piece placement was not valid: piece coords ${newCoords}`)
        }
    }

    rotatePiece(rotationDirection) {
        const kickOffsets = getKickOffsets(this.pieceQueue[0], rotationDirection, this.pieceOrientation)
        const newOrientation = (this.pieceOrientation + rotationDirection) % 4
        let newCoords;
        for (let kick of kickOffsets) {
            newCoords = this.pieceCoords.map((coord, index) => coord+kick[index])
            if (this.validPlacement(newCoords, this.pieceQueue[0], newOrientation)) {
                this.pieceOrientation = newOrientation;
                this.pieceCoords = newCoords;
                return;
            } else {continue}
        }
        // console.log("rotation failed")
    }
    
    findBottom() {
        let newCoords = [...this.pieceCoords]
        while (true) {
            if (this.validPlacement([newCoords[0], newCoords[1]-1], this.pieceQueue[0], this.pieceOrientation)) {
                newCoords[1] -= 1;
            } else {
                return newCoords
            }
            if (newCoords[1] <= -5){
                console.error("hard drop/ghost block loop looped too many times: check validPlacement() function")
                return
            }
        }
    }

    hardDrop() {
        this.pieceCoords = this.findBottom()
        this.placeActivePiece()
    }

    placeActivePiece() {
        this.placeTetromino(this.pieceCoords, this.pieceQueue[0], this.pieceOrientation)
        this.resetPieceState();
    }



    // queue n stuff

    inputQueue() {
        let inputtedQueue = prompt(`Enter new queue. Current queue is ${this.pieceQueue.toString().replaceAll(",","")}`)
        let inputtedQueueArray = inputtedQueue.toUpperCase().split("")
        if (inputtedQueueArray.every(char => "TILJSZO".includes(char))) {
            this.pieceQueue = inputtedQueueArray
        } else {
            alert("invalid queue, must only contain the pieces TILJSZO")
        }
        if (this.pieceQueue.length <= (this.previews + 2)) { 
            this.generateQueue();
        }
    }
    
    holdPiece() {
        [this.heldPiece, this.pieceQueue[0]] = [this.pieceQueue[0], this.heldPiece]
        if (this.pieceQueue[0] === "") {this.pieceQueue.shift()}
        this.pieceOrientation = 0;
        this.pieceCoords = [4, this.rows-2];
    }

    resetPieceState() {
        // actually reset piece state
        this.pieceQueue.shift()
        this.pieceOrientation = 0;
        this.pieceCoords = [4, this.rows-2];
        if (this.pieceQueue.length <= (this.previews + 2)) { 
             this.generateQueue();
        }

        // check board stuff

        // clear lines
        this.board = this.board.filter((row) => (!row.every((mino) => (mino !== "_"))))
        let amountOfRowsToAdd = this.rows-this.board.length
        for (let i = 0; i<(amountOfRowsToAdd); i++) {
            this.board.unshift(Array(this.columns).fill("_"))
        }
        

        // for (row of this.board) {
        //     if (row.every((mino) => (mino !== "_"))) {
        //         this.board.splice
        //         this.board.unshift(new Array(this.columns).fill("_"))
        //     }
        // }
    }

    generateQueue() {
        shuffleArray(this.pieceBag);
        this.pieceQueue = this.pieceQueue.concat(this.pieceBag);
    }

    
    // donuTransformations
    donuTransform(transformation) {
        let stackHeight = 0
        let leftmostTileIndex = this.columns - 1
        let rightmostTileIndex = 0
        if (transformation === "upBound" || transformation === "downBound") {
            
            for (let i = 0; i<this.board.length; i++) {
                if (!this.board[i].every(mino => (mino === "_"))) {
                    stackHeight = this.rows - i
                    break;
                }
                
            }
        }
        if (transformation === "leftBound" || transformation === "rightBound") {
            for (let row of this.board) {
                for (let i = 0; i<row.length; i++) {
                    if (row[i] !== "_") {
                        if (i < leftmostTileIndex) {
                            leftmostTileIndex = i;
                        }
                        break;
                    }
                }
            }
            
            for (let row of this.board) {
                for (let i = row.length-1; i>=0; i--) {
                    if (row[i] !== "_") {
                        if (i > rightmostTileIndex) {
                            rightmostTileIndex = i;
                        }
                        break;
                    }
                }
            }
        }
        switch (transformation) {
            case "left":
                for (let row of this.board) {
                    row.push(row[0])
                    row.shift()
                }
                break;
            case "right":
                for (let row of this.board) {
                    row.unshift(row.at(-1))
                    row.pop()
                }
                break;
            case "leftBound":
                for (let row of this.board) {
                    row.splice(rightmostTileIndex+1, 0, row[leftmostTileIndex])
                    row.splice(leftmostTileIndex, 1)
                }
                break; 
            case "rightBound":
                for (let row of this.board) {
                    row.splice(leftmostTileIndex, 0, row[rightmostTileIndex])
                    row.splice(rightmostTileIndex+1, 1)
                }
                break;
            case "upBound":
                this.board.push(this.board.at(-stackHeight))
                this.board.splice(-1 - stackHeight, 1)
                break;
            case "downBound":
                this.board.splice(0 - stackHeight, 0, this.board.at(-1))
                this.board.pop();
                break;
            default:
                console.error("invalid donut transformation!!!!!!!!!!!!!!!")
        }
    }
}




function gameLoop() {
    ctx.beginPath();
    ctx.rect(0, 0, 500, 575);
    ctx.fillStyle = "#303030"
    ctx.fill()
    ctx.closePath();
    donuBoard.drawBoard(125);
}
const donuBoard = new gameBoard(23, 10, 5)
// console.log(donuBoard.pieceQueue)
console.table(donuBoard)
// donuBoard.placeMino([3,1],"I")
// donuBoard.placeMino([1,3],"O")
// donuBoard.placeMino([3,20],"T")
// donuBoard.placeMino([10,1],"T")
// donuBoard.placeTetromino([5,5],"T",2)

document.addEventListener("keydown", (event) => {  // modified code from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    // console.log(event.key)
    switch (event.key) {
        case "ArrowDown":
            donuBoard.translatePiece([0, -1])
            break;
        case "ArrowUp":
            donuBoard.translatePiece([0, 1])
            break;
        case "ArrowLeft":
            donuBoard.translatePiece([-1, 0])
            break;
        case "ArrowRight":
            donuBoard.translatePiece([1, 0])
            break;
        case "d":
            donuBoard.rotatePiece(1)
            break;
        case "s":
            donuBoard.rotatePiece(2)
            break;
        case "a":
            donuBoard.rotatePiece(3)
            break;
        case " ":  // hard drop
            donuBoard.hardDrop()
            break;
        case "Shift":
            donuBoard.holdPiece()
            break;
        case "u":
            donuBoard.donuTransform("left")
            break;
        case "o":
            donuBoard.donuTransform("right")
            break;
        case "j":
            donuBoard.donuTransform("leftBound")
            break;
        case "l":
            donuBoard.donuTransform("rightBound")
            break;
        case "i":
            donuBoard.donuTransform("upBound")
            break;
        case "k": 
            donuBoard.donuTransform("downBound")
            break;
        case "q":
            donuBoard.inputQueue()
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);

donuBoard.drawBoard();
setInterval(gameLoop, 17)





// let pieceCoords = [3, 2];
// let piecePixelCoords = pieceCoords.map(x => 25*x)
// ctx.beginPath();
// ctx.rect(piecePixelCoords[0], piecePixelCoords[1], 100, 25);
// ctx.fillStyle = "#00D0FF";
// ctx.fill();
// ctx.strokeStyle = "#5ee1ff";
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.moveTo(piecePixelCoords[0], piecePixelCoords[1]+25);
// ctx.lineTo(piecePixelCoords[0]+100, piecePixelCoords[1]+25);
// ctx.lineTo(piecePixelCoords[0]+100, piecePixelCoords[1]);
// ctx.strokeStyle = "#00afd8";
// ctx.stroke();
// ctx.closePath();


// const userInput = document.querySelector("#user_input")
// const outputBox = document.querySelector("#output_text")
// userInput.addEventListener("keyup", () => {
//     outputBox.textContent = doThings(userInput.innerText)
// });