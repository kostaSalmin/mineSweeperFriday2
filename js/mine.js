'use strict'

const MINE = '💣'
const FLAG = '🚩'
var elTimer = document.querySelector('.timer');
var gElModal = document.querySelector('.modal');
var gTimer = 0;
var gMineCounterAround = 0;
var gMineCounter = 0;
var gTimeOut;
var minesArr = [];


var gLevel = {
    size: 4,
    mines: 2
}
var gBoard = {
    minesAroundCount: gMineCounterAround,
    isShown: false,
    isMine: false,
    isMarked: false

}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gGameBoard;


function init() {
    gGameBoard = createBoard()
    setMinesNegsCount()
    renderBoard(gGameBoard)
    document.querySelector('.restart').innerText = '😇'
    gGame.isOn = false;
    gTimer = 0;
    clearTimeout(gTimeOut)
    elTimer.innerText = gTimer
    document.querySelector('.counter').innerText = gLevel.mines
    gElModal.style.display = 'none'
    console.table(gGameBoard);
}


function setMinesNegsCount() {
    var row = 0;
    var col = 0;
    for (var j = 0; j < gLevel.mines; j++) {
        for (var i = 0; i < 2; i++) {
            if (i === 0) {
                row = getRandomIntInclusiveMy()

            } else {
                col = getRandomIntInclusiveMy()
            }
        }
        gGameBoard[row][col].isMine = true;
        gMineCounter++;
    }
}


function cellClicked(event, i, j) {
    var cell = document.querySelector('.cell-' + i + '-' + j)
    cell.style.backgroundColor = 'gray'
    if (gGameBoard[i][j].isMine) {
        cell.innerText = MINE
    }

    else {
        gGameBoard[i][j].isShown = true;
        gMineCounterAround = countMineAround(i, j);
        cell.innerText = gMineCounterAround
        if (gMineCounterAround === 0) cell.style.color = 'blue'
        if (gMineCounterAround === 1) cell.style.color = 'green'
        if (gMineCounterAround === 2) cell.style.color = 'orange'
        if (gMineCounterAround === 3) cell.style.color = 'red'
    }
    if (!gGame.isOn) {
        startTimer()
        gGame.isOn = true;
    }
    checkGameOver(gGameBoard[i][j])
}

function cellMarked(event, i, j) {
    var cell = document.querySelector('.cell-' + i + '-' + j)
    if (cell.isShown) return
    if (!gGameBoard[i][j].isShown) {
        gGameBoard[i][j].isMarked = true;
        cell.innerText = FLAG;
    }
}


function countMineAround(rowIdx, colIdx) {
    var counter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gGameBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gGameBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = gGameBoard[i][j];
            if (cell.isMine) counter++
        }
    }
    if (counter === 0) expandShown(rowIdx, colIdx);
    return counter;

}


function expandShown(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gGameBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gGameBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = gGameBoard[i][j];
            if (!currCell.isMine) {
                currCell.isShown = true;
                var elCell = document.querySelector('.cell-' + i + '-' + j)
                elCell.style.backgroundColor = "gray"
                elCell.innerText = gMineCounterAround
                if (gMineCounterAround === 0) elCell.style.color = 'blue'
                if (gMineCounterAround === 1) elCell.style.color = 'green'
                if (gMineCounterAround === 2) elCell.style.color = 'orange'
                if (gMineCounterAround === 3) elCell.style.color = 'red'
            }
        }
    }
}


function checkGameOver(cell) {
    var markedMines = 0;
    var shownsCells = 0;
    if (!cell.isMine) {
        for (var i = 0; i < gGameBoard.length; i++) {
            for (var j = 0; j < gGameBoard[0].length; j++) {
                var currCell = gGameBoard[i][j]
                if (currCell.isMine && currCell.isMarked) markedMines++
                if (currCell.isShown) shownsCells++
            }
        }
        if (markedMines === gLevel.mines && shownsCells === gLevel.size ** 2 - gLevel.mines) {
            gElModal.style.display = 'block'
            gElModal.innerText = 'you win!!!'
            // gGame.isOn = false;
            console.log('win');
        }

    } else {
        gElModal.style.display = 'block'
        gElModal.innerText = 'you lose!!!'
        console.log('you lose!!!!');
        document.querySelector('.restart').innerText = '😭'
        // gGame.isOn = false;
    }
}

function startTimer() {
    elTimer.innerText = gTimer
    gTimer = gTimer + 1.0;
    gTimeOut = setTimeout(startTimer, 1000);
}

