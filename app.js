const gameController = (() => {
  const _board = new Array(9);
  const _squares = document.querySelectorAll(".square");
  let _gameOver = false;
  let _result = undefined;
  let _turn = 0;
  const _WINNING_COMBOS = [
    //horizontal combos
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //vertical combos
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonal combos
    [0, 4, 8],
    [6, 4, 2],
  ];

  const reset = function () {
    _squares.forEach((square, index) => {
      _board[index] = undefined;
      square.innerText = "";
      square.classList.remove("user", "ai");
    });

    _gameOver = false;
    _turn = 0;
    _result = undefined;
  };

  // event listener to restart the game;
  document.querySelector(".play-again").addEventListener("click", () => {
    document.querySelector(".modal").classList.toggle("hidden");
    reset();
  });

  _squares.forEach((square, index) => {
    square.addEventListener("click", () => {
      if (square.innerText !== "") return;

      square.innerText = player.sign;
      square.classList.add("user");
      _board[index] = player.sign;
      _turn++;
      checkWinner();
      aiLogic();
    });
  });

  const aiLogic = function () {
    let nextMove;
    if (_gameOver) return;

    for (let index = 0; index < _WINNING_COMBOS.length; index++) {
      const combo = _WINNING_COMBOS[index].map((element) => {
        return _board[element] ? _board[element] : element;
      });
      const filled = combo.filter((value) => Number(value)).length === 0;

      // checking for filled square or any optimal moves
      if (filled) {
        continue;
      } else if (ai.checkmate(combo)) {
        nextMove = ai.checkmate(combo);
        break;
      } else if (ai.playDefense(combo, player.sign)) {
        nextMove = ai.playDefense(combo, player.sign);
      }
    }

    if (!nextMove && !_board[4]) {
      nextMove = 4;
    } else if (!nextMove) {
      nextMove = ai.randomSquare(_board);
    }

    _board[nextMove] = ai.sign;
    _squares[nextMove].innerText = ai.sign;
    _squares[nextMove].classList.add("ai");
    _turn++;
    checkWinner();
  };

  const displayWinner = () => {
    const display = document.querySelector(".display-winner");
    console.log(display);
    if (_result === "tie") {
      display.innerText = "The game ended in a tie!";
    } else {
      display.innerText =
        _result.name.split("")[0].toUpperCase() +
        _result.name.split("").slice(1).join("") +
        " won the game!";
    }
  };

  const checkWinner = function () {
    for (let index = 0; index < _WINNING_COMBOS.length; index++) {
      const currentSub = _WINNING_COMBOS[index].map((num) => _board[num]);
      if (currentSub.every((num) => num)) {
        if (currentSub.every((num) => num === player.sign)) {
          _gameOver = true;
          _result = player;
          break;
        } else if (currentSub.every((num) => num === ai.sign)) {
          _gameOver = true;
          _result = ai;
          break;
        }
      }
    }

    if (_turn >= 9) {
      _result = "tie";
      _gameOver = true;
    }

    if (_gameOver) {
      document.querySelector(".modal").classList.toggle("hidden");
      displayWinner();
    }
  };

  return { reset };
})();

const addPlayer = function (name, sign) {
  const checkmate = function (array) {
    const result = array.filter((value) => value === sign).length >= 2;
    return result && array.filter((value) => value !== sign)[0];
  };

  const playDefense = function (array, opponent) {
    const result = array.filter((value) => value === opponent).length >= 2;
    return result && array.filter((value) => value !== opponent)[0];
  };

  const randomSquare = function (array) {
    let result;
    for (let index = 0; index < array.length; index++) {
      if (!array[index]) {
        result = index;
        break;
      }
    }

    return result;
  };

  return { name, sign, checkmate, playDefense, randomSquare };
};

const player = addPlayer("player one", "X");
const ai = addPlayer("player two", "O");
