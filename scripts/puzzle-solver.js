// Define possible move directions and their corresponding coordinate changes
const DIRECTIONS = { "U": [1, 0], "D": [-1, 0], "L": [0, 1], "R": [0, -1] };

// Define the goal state of the puzzle
const END = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

// Unicode characters for drawing the puzzle borders
const left_down_angle = '\u2514';
const right_down_angle = '\u2518';
const right_up_angle = '\u2510';
const left_up_angle = '\u250C';
const middle_junction = '\u253C';
const top_junction = '\u252C';
const bottom_junction = '\u2534';
const right_junction = '\u2524';
const left_junction = '\u251C';
const bar = '|';
const dash = '\u2500';

// Predefined border lines for the puzzle display
const first_line = `${left_up_angle}${dash.repeat(3)}${top_junction}${dash.repeat(3)}${top_junction}${dash.repeat(3)}${right_up_angle}`;
const middle_line = `${left_junction}${dash.repeat(3)}${middle_junction}${dash.repeat(3)}${middle_junction}${dash.repeat(3)}${right_junction}`;
const last_line = `${left_down_angle}${dash.repeat(3)}${bottom_junction}${dash.repeat(3)}${bottom_junction}${dash.repeat(3)}${right_down_angle}`;

// Function to print the current state of the puzzle
function printPuzzle(array) {
    console.log(first_line);
    for (let a = 0; a < array.length; a++) {
        let row = '';
        for (let i of array[a]) {
            row += `${bar} ${i === 9 ? '*' : i} `;
        }
        console.log(row + bar);
        console.log(a === 2 ? last_line : middle_line);
    }
}

// Node class to represent a state in the search space
class Node {
    constructor(current_node, previous_node, g, h, dir) {
        this.current_node = current_node;  // Current puzzle state
        this.previous_node = previous_node;  // Previous puzzle state
        this.g = g;  // Cost to reach this node
        this.h = h;  // Heuristic estimate to goal
        this.dir = dir;  // Direction taken to reach this state
    }

    // Calculate total estimated cost
    f() {
        return this.g + this.h;
    }
}

// Function to find the position of a given element in the puzzle
function getPos(current_state, element) {
    for (let row = 0; row < current_state.length; row++) {
        let col = current_state[row].indexOf(element);
        if (col !== -1) return [row, col];
    }
}

// Heuristic function: calculate the Manhattan distance
function euclidianCost(current_state) {
    let cost = 0;
    for (let row = 0; row < current_state.length; row++) {
        for (let col = 0; col < current_state[0].length; col++) {
            let pos = getPos(END, current_state[row][col]);
            cost += Math.abs(row - pos[0]) + Math.abs(col - pos[1]);
        }
    }
    return cost;
}

// Generate adjacent nodes (possible next moves)
function getAdjNode(node) {
    let listNode = [];
    let emptyPos = getPos(node.current_node, 9);

    for (let dir in DIRECTIONS) {
        let newPos = [emptyPos[0] + DIRECTIONS[dir][0], emptyPos[1] + DIRECTIONS[dir][1]];
        if (newPos[0] >= 0 && newPos[0] < node.current_node.length && newPos[1] >= 0 && newPos[1] < node.current_node[0].length) {
            let newState = JSON.parse(JSON.stringify(node.current_node));
            newState[emptyPos[0]][emptyPos[1]] = node.current_node[newPos[0]][newPos[1]];
            newState[newPos[0]][newPos[1]] = 9;
            listNode.push(new Node(newState, node.current_node, node.g + 1, euclidianCost(newState), dir));
        }
    }

    return listNode;
}

// Select the best node from the open set based on f-score
function getBestNode(openSet) {
    let bestNode;
    let bestF = Infinity;

    for (let node of Object.values(openSet)) {
        if (node.f() < bestF) {
            bestNode = node;
            bestF = node.f();
        }
    }
    return bestNode;
}

// Reconstruct the path from start to goal
function buildPath(closedSet) {
    let node = closedSet[JSON.stringify(END)];
    let branch = [];

    while (node.dir) {
        branch.push({ dir: node.dir, node: node.current_node });
        node = closedSet[JSON.stringify(node.previous_node)];
    }
    branch.push({ dir: '', node: node.current_node });
    return branch.reverse();
}

// Main A* search algorithm
function main(puzzle) {
    let open_set = { [JSON.stringify(puzzle)]: new Node(puzzle, puzzle, 0, euclidianCost(puzzle), "") };
    let closed_set = {};

    while (true) {
        let test_node = getBestNode(open_set);
        closed_set[JSON.stringify(test_node.current_node)] = test_node;

        if (JSON.stringify(test_node.current_node) === JSON.stringify(END)) {
            return buildPath(closed_set);
        }

        let adj_node = getAdjNode(test_node);
        for (let node of adj_node) {
            if (closed_set[JSON.stringify(node.current_node)] ||
                (open_set[JSON.stringify(node.current_node)] && open_set[JSON.stringify(node.current_node)].f() < node.f())) {
                continue;
            }
            open_set[JSON.stringify(node.current_node)] = node;
        }

        delete open_set[JSON.stringify(test_node.current_node)];
    }
}

// // Solve the puzzle and extract the moves
// let br = main([
//     [6, 2, 8],
//     [4, 7, 1],
//     [9, 3, 5]
// ]);

// // Extract only the directions from the solution
// let moves = br.map(step => step.dir).filter(dir => dir !== '');

// // Output the moves as a character array
// // console.log(moves);

function solvePuzzle(puzzleState) {
    let currentState = puzzleState.map(row => row.map(val => val === 0 ? 9 : val));
    let br = main(currentState);
    let moves = br.map(step => step.dir).filter(dir => dir !== '');
    return moves;
}

// Export fungsi yang akan digunakan di main.js
export { solvePuzzle };