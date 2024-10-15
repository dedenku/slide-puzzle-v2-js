import { solvePuzzle } from './puzzle-solver.js';

const puzzleContainer = document.querySelector("#puzzle-container");
const moveCounterElement = document.querySelector("#move-counter");

let puzzle = [];
let puzzleState2d = [];
let size = 3;
const blockSize = 150;
let moveCounter = 0;

generatePuzzle();
randomizePuzzle();
renderPuzzle();
handleInput();
updatePuzzleState2D();
checkPuzzleSolved();

function resetCounter() {
    moveCounter = 0;
    moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
}

document.querySelector("#shuffle-puzzle").addEventListener('click', function () {
    puzzle = [];
    resetCounter();
    generatePuzzle();
    randomizePuzzle();
    renderPuzzle();
    handleInput();
    updatePuzzleState2D();
    checkPuzzleSolved();
});

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
}

function renderPuzzle() {
    puzzleContainer.innerHTML = ''
    for (let puzzleItem of puzzle) {
        if (puzzleItem.disabled) continue;
        puzzleContainer.innerHTML += `
        <div class = "puzzle-item" style = "left: ${puzzleItem.x}px; top: ${puzzleItem.y}px">
            <p class="puzzle-numbers">${puzzleItem.value}</p>
        </div>
        `;
    }
}

function randomizePuzzle() {
    do {
        const randomValues = getRandomValues();
        let i = 0;
        for (let puzzleItem of puzzle) {
            puzzleItem.value = randomValues[i];
            i++;
        }

        const puzzleNine = puzzle.find(item => item.value === size * size);
        puzzleNine.disabled = true;
        moveCounter = 0;
        updatePuzzleState2D();
    } while (!isSolvable(puzzleState2d));
    resetCounter();
    updatePuzzleState2D();
    checkPuzzleSolved();
}

// function isSolvable(state) {
//     let flatState = state.flat().filter(x => x !== 9);
//     let inversions = 0;
//     for (let i = 0; i < flatState.length; i++) {
//         for (let j = i + 1; j < flatState.length; j++) {
//             if (flatState[i] > flatState[j]) {
//                 inversions++;
//             }
//         }
//     }
//     return inversions % 2 === 0;
// }
function isSolvable(state) {
    // Flatten state if it's a 2D array
    const flatState = Array.isArray(state[0]) ? state.flat() : state;

    // Validate input
    if (flatState.length !== 9 || !flatState.every(n => n >= 1 && n <= 9)) {
        throw new Error("Input harus berisi angka 1-9");
    }

    // Count inversions, ignoring the empty tile (9)
    let inversions = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 9; j++) {
            if (flatState[i] !== 9 && flatState[j] !== 9 && flatState[i] > flatState[j]) {
                inversions++;
            }
        }
    }

    // A 3x3 puzzle is solvable if the number of inversions is even
    return inversions % 2 === 0;
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
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            checkPuzzleSolved();
            break;

        case 'ArrowRight':
            moveRigth();
            checkPuzzleSolved();
            break;

        case 'ArrowUp':
            moveUp();
            checkPuzzleSolved();
            break;

        case 'ArrowDown':
            moveDown();
            checkPuzzleSolved();
            break;
    }
    renderPuzzle();
    updatePuzzleState2D();
    checkPuzzleSolved();
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

function updatePuzzleState2D() {
    puzzleState2d = [];
    for (let i = 0; i < size; i++) {
        puzzleState2d[i] = [];
        for (let j = 0; j < size; j++) {
            const puzzleItem = puzzle.find(item => item.position === i * size + j + 1);
            puzzleState2d[i][j] = puzzleItem ? puzzleItem.value : 0;
        }
    }
}
function checkPuzzleSolved() {
    const solvedPuzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    if (puzzleState2d === solvedPuzzle) {
        alert("PUZZLE SOLVED!")
    }
}


document.querySelector("#get-puzzle-array").addEventListener('click', function () {
    console.log(puzzle);
    console.log(puzzleState2d);
    const moves = solvePuzzle(puzzleState2d);
    console.log(moves);
});

async function animateSolution(moves) {
    for (let move of moves) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        switch (move) {
            case "L":
                moveLeft();
                break;
            case "R":
                moveRigth();
                break;
            case "U":
                moveUp();
                break;
            case "D":
                moveDown();
                break;
        }
        renderPuzzle();
        updatePuzzleState2D();
        checkPuzzleSolved();
    }
}

document.getElementById('solve-button').addEventListener('click', async function () {
    const moves = solvePuzzle(puzzleState2d);
    console.log(moves);
    resetCounter();
    await animateSolution(moves);
});