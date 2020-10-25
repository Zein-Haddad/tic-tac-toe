const gameBoard = (() => {
  let _board = ['', '', '', '', '', '', '', '', ''];
  let _boardElem = document.querySelectorAll('.board-box')
  let _playersDisplay = document.querySelectorAll('[player-display]');
  
  const _displayBoard = () => {
    _boardElem.forEach ((b, i) => {
      b.textContent = _board[i];
    });
  }

  const toggleDisplay = (turn) => {
    _playersDisplay.forEach ((d, i) => {
      if (i === turn) {
        d.classList.add('score-text-active');
      } else {
        d.classList.remove('score-text-active');
      }
    })
  };

  const setBoard = (pos, mark) => {
    if (_board[pos] !== '') return false;

    _board[pos] = mark;
    _displayBoard();
    return true;
  }

  const emptyBoard = () => {
    _board = ['', '', '', '', '', '', '', '', ''];
    _displayBoard();
  }

  return {setBoard, toggleDisplay, emptyBoard};
})();

const makePlayer = (mark = 'O') => {
  const takeTurn = (pos) => {
    let turn = gameBoard.setBoard(pos, mark);
    return turn;
  }

  return {takeTurn};
};

const gameMaster = (() => {
  let _players = [makePlayer('O'), makePlayer('X')];
  let _currentTurn = 0;

  const _nextTurn = () => {
    if (_currentTurn === 0) {
      _currentTurn = 1;
    } else {
      _currentTurn = 0;
    }
  };

  const takeTurn = (pos) => {
    let turn = _players[_currentTurn].takeTurn(pos);
    if (turn) {
      _nextTurn();
      gameBoard.toggleDisplay(_currentTurn);
    }
  };

  const reset = () => {
    _currentTurn = 0;
    gameBoard.emptyBoard();
    gameBoard.toggleDisplay(_currentTurn);
  };

  return {takeTurn, reset};
})();

document.querySelectorAll('.board-box').forEach ((b) => {
  b.addEventListener('click', () => { gameMaster.takeTurn(b.getAttribute('pos')) });
})
