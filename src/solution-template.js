/*
*
* "board" is a matrix that holds data about the
* game board, in a form of BoardSquare objects
*
* openedSquares holds the position of the opened squares
*
* flaggedSquares holds the position of the flagged squares
*
 */
let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;

/*
*
* the probability of a bomb in each square
*
 */
let bombProbability = 3;
let maxProbability = 15;

function minesweeperGameBootstrapper(rowCount, colCount) {
  let easy = {
    'rowCount': 9,
    'colCount': 9,
  };
  let medium = {
    'rowCount': 16,
    'colCount': 16,
  };
  let expert = {
    'rowCount': 16,
    'colCount': 30,
  };

  const difficulties = {
    easy,
    medium,
    expert,
  };

  const selectedDifficulty = document.getElementById("difficulty").value;

  /*
  *
  * TODO have a default difficulty
  *
   */
  const boardMetadata = difficulties[selectedDifficulty] || { rowCount, colCount };

  generateBoard(boardMetadata);
}

function generateBoard(boardMetadata) {
  squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;
  board = Array.from(Array(boardMetadata.rowCount), () =>
    new Array(boardMetadata.colCount)
  );

  /*
  *
  * "generate" an empty matrix
  *
  */

  /*
  *
  * TODO fill the matrix with "BoardSquare" objects, that are in a pre-initialized state
  *
  */
  for (let i = 0; i < boardMetadata.rowCount; i++) {
    for (let j = 0; j < boardMetadata.colCount; j++) {
      let hasBomb = Math.random() * maxProbability < bombProbability;
      board[i][j] = new BoardSquare(hasBomb, 0);
    }
  }

  /*
  *
  * TODO count the bombs around each square
  *
  */

  countBombsAround();

  /*
  *
  * TODO set the state of the board, with all the squares closed
  * and no flagged squares
  *
   */

  renderBoard(boardMetadata.rowCount, boardMetadata.colCount);

  /*
  *
  * print the board to the console to see the result
  *
  */
  console.log(board);
}

function countBombsAround() {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].hasBomb) continue;

      let bombCounter = 0;
      for (let [dx, dy] of directions) {
        let x = i + dx;
        let y = j + dy;

        if (x >= 0 && y >= 0 && x < board.length && y < board[i].length) {
          if (board[x][y].hasBomb) bombCounter++;
        }
      }

      board[i][j].bombsAround = bombCounter;
    }
  }
}

function renderBoard(rows, cols) {
  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";
  boardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  boardContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.addEventListener("click", () => discoverTile(i, j));
      squareDiv.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(i, j);
      });
      boardContainer.appendChild(squareDiv);
    }
  }
}

function discoverTile(x, y) {
  const square = board[x][y];

  if (openedSquares.includes(`${x}-${y}`) || flaggedSquares.includes(`${x}-${y}`)) {
    return;
  }

  const squareDiv = document.querySelector(`#board div:nth-child(${x * board[0].length + y + 1})`);

  if (square.hasBomb) {
    squareDiv.classList.add("bomb");
    alert("Game Over!");
  } else {
    squareDiv.classList.add("open");
    squareDiv.innerHTML = square.bombsAround ? square.bombsAround : "";
    openedSquares.push(`${x}-${y}`);
    squaresLeft--;

    if (square.bombsAround === 0) {
      floodFill(x, y);
    }

    if (squaresLeft === bombCount) {
      alert("You Win!");
    }
  }
}

function floodFill(x, y) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (let [dx, dy] of directions) {
    let newX = x + dx;
    let newY = y + dy;

    if (newX >= 0 && newY >= 0 && newX < board.length && newY < board[0].length) {
      discoverTile(newX, newY);
    }
  }
}

function toggleFlag(x, y) {
  const squareDiv = document.querySelector(`#board div:nth-child(${x * board[0].length + y + 1})`);
  const key = `${x}-${y}`;

  if (flaggedSquares.includes(key)) {
    flaggedSquares = flaggedSquares.filter((flag) => flag !== key);
    squareDiv.classList.remove("flagged");
  } else {
    flaggedSquares.push(key);
    squareDiv.classList.add("flagged");
  }
}

function handleDifficultyChange() {
  minesweeperGameBootstrapper();
}

function handleProbabilityChange() {
  bombProbability = document.getElementById("bombProbability").value;
  minesweeperGameBootstrapper();
}

function handleMaxProbabilityChange() {
  maxProbability = document.getElementById("maxProbability").value;
  minesweeperGameBootstrapper();
}

/*
*
* simple object to keep the data for each square
* of the board
*
*/
class BoardSquare {
  constructor(hasBomb, bombsAround) {
    this.hasBomb = hasBomb;
    this.bombsAround = bombsAround;
  }
}

/*
*
* call the function that "handles the game"
* called at the end of the file, because if called at the start,
* all the global variables will appear as undefined / out of scope
*
 */
minesweeperGameBootstrapper();
