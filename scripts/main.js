const puzzleContainer = document.querySelector("#puzzle-container");

let puzzle = [];
let size = 3;
const blockSize = 200;

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

}

function moveLeft() {

}

function moveRigth() {

}

function moveUp() {

}

function moveDown() {

}