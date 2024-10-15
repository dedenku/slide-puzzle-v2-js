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
