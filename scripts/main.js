const puzzleContainer = document.querySelector("#puzzle-container");
const moveCounterElement = document.querySelector("#move-counter");

let puzzle = [];
let size = 3;
const blockSize = 150;
let moveCounter = 0;

generatePuzzle();
randomizePuzzle();
renderPuzzle();
handleInput();

function getRow(pos) {
    return Math.ceil(pos / size);
}

function getCol(pos) {
    const col = pos % size;
    if (col === 0) {
        return size
    }
    return col
}

function generatePuzzle() {
    for (let i = 1; i <= size * size; i++) {
        puzzle.push({
            value: i,
            position: i,
            x: (getCol(i) - 1) * blockSize,
            y: (getRow(i) - 1) * blockSize,
            disabled: false
        });
    }
    console.log(puzzle);
}

function renderPuzzle() {
    puzzleContainer.innerHTML = ''
    for (let puzzleItem of puzzle) {
        if (puzzleItem.disabled) continue;
        puzzleContainer.innerHTML += `
        <div class = "puzzle-item" style = "left: ${puzzleItem.x}px; top: ${puzzleItem.y}px">
            ${puzzleItem.value}
        </div>
        `;
    }
}

function randomizePuzzle() {
    const randomValues = getRandomValues();
    console.log(randomValues);
    let i = 0;
    for (let puzzleItem of puzzle) {
        puzzleItem.value = randomValues[i];
        i++;
    }

    const puzzleNine = puzzle.find(item => item.value === size * size);
    puzzleNine.disabled = true;
    moveCounter = 0;
}

function getRandomValues() {
    const values = []
    for (let i = 1; i <= size * size; i++) {
        values.push(i);
    }

    const randomValues = values.sort(() => Math.random() - 0.5);
    return randomValues;
}

function handleInput() {
    document.addEventListener('keydown', handelKeyDown)
}

function handelKeyDown(e) {
    console.log(e.key)
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;

        case 'ArrowRight':
            moveRigth();
            break;

        case 'ArrowUp':
            moveUp();
            break;

        case 'ArrowDown':
            moveDown();
            break;
    }
    renderPuzzle();
}

function moveLeft() {
    const emptyPuzzle = getEmptyPuzzle();
    const rightPuzzle = getRightPuzzle();
    if (rightPuzzle) {
        swapPositions(emptyPuzzle, rightPuzzle, true);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function moveRigth() {
    const emptyPuzzle = getEmptyPuzzle();
    const leftPuzzle = getLeftPuzzle();
    if (leftPuzzle) {
        swapPositions(emptyPuzzle, leftPuzzle, true);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function moveUp() {
    const emptyPuzzle = getEmptyPuzzle();
    const bellowPuzzle = getBellowPuzzle();
    if (bellowPuzzle) {
        swapPositions(emptyPuzzle, bellowPuzzle, false);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function moveDown() {
    const emptyPuzzle = getEmptyPuzzle();
    const abovePuzzle = getAbovePuzzle();
    if (abovePuzzle) {
        swapPositions(emptyPuzzle, abovePuzzle, false);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function swapPositions(firstPuzzle, seconsPuzzle, isX = false) {
    let temp = firstPuzzle.position;
    firstPuzzle.position = seconsPuzzle.position;
    seconsPuzzle.position = temp;

    if (isX) {
        temp = firstPuzzle.x;
        firstPuzzle.x = seconsPuzzle.x;
        seconsPuzzle.x = temp;
    } else {
        temp = firstPuzzle.y;
        firstPuzzle.y = seconsPuzzle.y;
        seconsPuzzle.y = temp;
    }

}

function getLeftPuzzle() {
    const emptyPuzzle = getEmptyPuzzle();
    const isLeftEdge = getCol(emptyPuzzle.position) === 1;
    if (isLeftEdge) {
        return null;
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position - 1);
    return puzzle;
}

function getRightPuzzle() {
    const emptyPuzzle = getEmptyPuzzle();
    const isRightEdge = getCol(emptyPuzzle.position) === size;
    if (isRightEdge) {
        return null;
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position + 1);
    return puzzle;
}

function getAbovePuzzle() {
    const emptyPuzzle = getEmptyPuzzle();
    const isTopEdge = getRow(emptyPuzzle.position) === 1;
    if (isTopEdge) {
        return null;
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position - size);
    return puzzle;
}

function getBellowPuzzle() {
    const emptyPuzzle = getEmptyPuzzle();
    const isBottomEdge = getRow(emptyPuzzle.position) === size;
    if (isBottomEdge) {
        return null;
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position + size);
    return puzzle;
}

function getEmptyPuzzle() {
    return puzzle.find((item) => item.disabled)
}

function getPuzzleByPos(pos) {
    return puzzle.find((item) => item.position === pos)
}