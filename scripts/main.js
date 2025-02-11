// Import the puzzle solver function
import { solvePuzzle } from './puzzle-solver.js';

// Select DOM elements and initialize variables
const puzzleContainer = document.querySelector("#puzzle-container");
const moveCounterElement = document.querySelector("#move-counter");
let moveCounter = 0;

const astarStepsElement = document.querySelector("#astar-steps");
let astarSteps = 0;

let puzzle = [];
let puzzleState2d = [];
let size = 3;
let isAnimating = false;
let animationStopped = false;

// Initialize the puzzle
generatePuzzle();
randomizePuzzle();
renderPuzzle();
handleInput();
updatePuzzleState2D();
updateAStarSteps();
checkPuzzleSolved();

// Reset the move counter and update A* steps
function resetCounter() {
    moveCounter = 0;
    moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    updateAStarSteps();
}

// Update the number of steps required by A* algorithm
function updateAStarSteps() {
    astarSteps = solvePuzzle(puzzleState2d).length;
    astarStepsElement.innerHTML = `A* STEPS: ${astarSteps}`;
}

// Event listener for shuffling the puzzle
document.querySelector("#shuffle-puzzle").addEventListener('click', function () {
    if (isAnimating) return;
    puzzle = [];
    resetCounter();
    generatePuzzle();
    randomizePuzzle();
    renderPuzzle();
    handleInput();
    updatePuzzleState2D();
});

// Helper function to get the row of a position
function getRow(pos) {
    return Math.ceil(pos / size);
}

// Helper function to get the column of a position
function getCol(pos) {
    const col = pos % size;
    if (col === 0) {
        return size
    }
    return col
}

// Generate the initial puzzle state
function generatePuzzle() {
    for (let i = 1; i <= size * size; i++) {
        const { x, y } = calculatePosition(i);
        puzzle.push({
            value: i,
            position: i,
            x: x,
            y: y,
            disabled: false
        });
    }
}

// Render the puzzle in the DOM
function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    for (let puzzleItem of puzzle) {
        const puzzleElement = document.createElement('div');
        puzzleElement.className = 'puzzle-item';
        puzzleElement.id = `puzzle-item-${puzzleItem.value}`;
        puzzleElement.innerHTML = `<p class="puzzle-numbers">${puzzleItem.value}</p>`;
        puzzleElement.style.transform = `translate(${puzzleItem.x}%, ${puzzleItem.y}%)`;
        puzzleElement.addEventListener('click', () => handlePuzzleClick(puzzleItem));
        if (puzzleItem.disabled) {
            puzzleElement.style.visibility = 'hidden';
        }
        puzzleContainer.appendChild(puzzleElement);
    }
}

// Handle click events on puzzle pieces
function handlePuzzleClick(clickedItem) {
    const emptyPuzzle = getEmptyPuzzle();

    // Check if the clicked piece is adjacent to the empty space
    if (isAdjacent(clickedItem, emptyPuzzle)) {
        swapPositions(clickedItem, emptyPuzzle);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
        updatePuzzleState2D();
        checkPuzzleSolved();

    }
    if (isAnimating) return; // Ignore clicks during animation

    const clickedElement = clickedItem.target.closest('.puzzle-item');
    if (!clickedElement) return;

    const position = parseInt(clickedElement.dataset.position);
    const onClickedItem = puzzle.find(item => item.position === position);

    if (onClickedItem) {
        handlePuzzleClick(onClickedItem, clickedElement);
    }
}

// Check if two puzzle pieces are adjacent
function isAdjacent(item1, item2) {
    const rowDiff = Math.abs(getRow(item1.position) - getRow(item2.position));
    const colDiff = Math.abs(getCol(item1.position) - getCol(item2.position));

    // Blok bersebelahan jika perbedaan baris + kolom = 1
    return (rowDiff + colDiff === 1);
}

// Randomize the puzzle
function randomizePuzzle() {
    resetPuzzleStatus();
    do {
        const randomValues = getRandomValues();
        for (let i = 0; i < puzzle.length; i++) {
            puzzle[i].value = randomValues[i];
            puzzle[i].disabled = (randomValues[i] === size * size);
        }
        moveCounter = 0;
        updatePuzzleState2D();
    } while (!isSolvable(puzzleState2d));
    resetCounter();
    updatePuzzleState2D();
    updateAStarSteps();
}

// Check if the puzzle is solvable
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

// Generate random values for puzzle pieces
function getRandomValues() {
    const values = []
    for (let i = 1; i <= size * size; i++) {
        values.push(i);
    }

    const randomValues = values.sort(() => Math.random() - 0.5);
    return randomValues;
}

// Set up keyboard input handling
function handleInput() {
    document.addEventListener('keydown', handelKeyDown)
}

// Handle keyboard input
function handelKeyDown(e) {
    if (isAnimating) return; // Ignore input during animation
    switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRigth(); break;
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
    }
    updatePuzzleState2D();
    checkPuzzleSolved(false);
}

// Move functions for each direction
function moveLeft() {
    const emptyPuzzle = getEmptyPuzzle();
    const rightPuzzle = getRightPuzzle();
    if (rightPuzzle) {
        swapPositions(emptyPuzzle, rightPuzzle);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function moveRigth() {
    const emptyPuzzle = getEmptyPuzzle();
    const leftPuzzle = getLeftPuzzle();
    if (leftPuzzle) {
        swapPositions(emptyPuzzle, leftPuzzle);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function moveUp() {
    const emptyPuzzle = getEmptyPuzzle();
    const bellowPuzzle = getBellowPuzzle();
    if (bellowPuzzle) {
        swapPositions(emptyPuzzle, bellowPuzzle);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

function moveDown() {
    const emptyPuzzle = getEmptyPuzzle();
    const abovePuzzle = getAbovePuzzle();
    if (abovePuzzle) {
        swapPositions(emptyPuzzle, abovePuzzle);
        moveCounter++;
        moveCounterElement.innerHTML = `MOVES: ${moveCounter}`;
    }
}

// Swap positions of two puzzle pieces
function swapPositions(item1, item2) {
    // Swap position, x, and y values
    const tempPosition = item1.position;
    item1.position = item2.position;
    item2.position = tempPosition;

    // Update DOM elements
    const tempX = item1.x;
    item1.x = item2.x;
    item2.x = tempX;

    const tempY = item1.y;
    item1.y = item2.y;
    item2.y = tempY;

    const element1 = document.getElementById(`puzzle-item-${item1.value}`);
    const element2 = document.getElementById(`puzzle-item-${item2.value}`);

    if (element1) element1.style.transform = `translate(${item1.x}%, ${item1.y}%)`;
    if (element2) element2.style.transform = `translate(${item2.x}%, ${item2.y}%)`;
}

// Calculate position based on puzzle piece number
function calculatePosition(position) {
    const row = Math.floor((position - 1) / size);
    const col = (position - 1) % size;
    return {
        x: col * (200 / (size - 1)),
        y: row * (200 / (size - 1))
    };
}

// Reset puzzle status (disable the last piece)
function resetPuzzleStatus() {
    for (let puzzleItem of puzzle) {
        puzzleItem.disabled = (puzzleItem.value === size * size);
    }
}

// Helper functions to get adjacent puzzle pieces
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

// Get the empty puzzle piece
function getEmptyPuzzle() {
    return puzzle.find(item => item.value === size * size);
}

// Get puzzle piece by position
function getPuzzleByPos(pos) {
    return puzzle.find((item) => item.position === pos)
}

// Update the 2D representation of the puzzle state
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

// Check if the puzzle is solved
function checkPuzzleSolved(isAutoSolved = false) {
    const solvedPuzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const isSolved = puzzleState2d.every((row, i) =>
        row.every((value, j) => value === solvedPuzzle[i][j])
    );

    if (isSolved) {
        const title = document.getElementById('puzzle-solved-title');
        const message = document.getElementById('puzzle-solved-message');

        if (isAutoSolved) {
            title.textContent = "Puzzle Solved Automatically!";
            message.textContent = "The puzzle has been solved using the automatic solver.";
        } else {
            title.textContent = "Congratulations!";
            message.textContent = `You've solved the puzzle manually in ${moveCounter} moves!`;
        }

        setTimeout(() => {
            document.getElementById('puzzle-solved-popup').style.display = 'flex';
        }, 500);
    }
}

// Close the solved puzzle popup
document.getElementById('close-popup').addEventListener('click', function () {
    document.getElementById('puzzle-solved-popup').style.display = 'none';
});

// Animate the solution
async function animateSolution(moves) {
    isAnimating = true;
    puzzleContainer.classList.add('animating');
    animationStopped = false;
    for (let i = 0; i < moves.length; i++) {
        if (animationStopped) break;
        await new Promise(resolve => setTimeout(resolve, 500));
        switch (moves[i]) {
            case "L": moveLeft(); break;
            case "R": moveRigth(); break;
            case "U": moveUp(); break;
            case "D": moveDown(); break;
        }
        updatePuzzleState2D();
    }
    isAnimating = false;
    puzzleContainer.classList.remove('animating');
    checkPuzzleSolved(true);
}

// Event listener for the solve button
document.getElementById('solve-button').addEventListener('click', async function () {
    if (isAnimating) return;
    const moves = solvePuzzle(puzzleState2d);
    resetCounter();
    await animateSolution(moves);
});

// Event listener to stop the solving animation
document.getElementById('stop-animation').addEventListener('click', function () {
    isAnimating = false;
    animationStopped = true;
    puzzleContainer.classList.remove('animating');
});