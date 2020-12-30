/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
let board = [];
let gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = (HEIGHT, WIDTH) => board = [...Array(HEIGHT)].map(x => Array(WIDTH).fill(0)); 

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = (HEIGHT, WIDTH) => {
// get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // create interactive top row for dropping game piece
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  for(let i = board.length - 1; i >= 0; i--) {
    if (board[i][x] === 0) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece', `player${currPlayer}`);
  piece.animate([
    {transform: `translateY(${-50 * (y + 2)}px)`},
    {transform: 'translateY(0px)'}
  ], {
    duration: 1500
  })
  document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */
const endGame = (msg) => alert(msg);

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  if (gameOver) {
    endGame('Game is over! Start a new game!');
    return;
  }

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  
  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell !== 0))) {
    gameOver = true;
    endGame('Tie game!  Board is filled!');
  }
  
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  setStatus();
}

const setStatus = () => document.querySelector('#turn').innerText = `Player${currPlayer}'s turn!`;

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  /* Iterate through every point, obtain the four coordinate values that
     correspond to a win condition, pass them to _win check function */
  for (let y = 0; y < HEIGHT; y++) { 
    for (let x = 0; x < WIDTH; x++) { 
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        gameOver = true;
        return true;
      }
    }
  }
}

const reset = () => {
  for (let tr of document.querySelectorAll('tr')) {
    tr.remove();
  }
  currPlayer = 1;
  gameOver = false;
  setStatus();
  makeBoard(HEIGHT, WIDTH);
  makeHtmlBoard(HEIGHT, WIDTH); 
}

document.querySelector('button').addEventListener('click', (e) => {
  reset();
})

window.addEventListener('load', function(e) {
  reset();
});
