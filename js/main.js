const gameBoard = (() => {
  let _board = ['', '', '', '', '', '', '', '', ''];
  let _boardElem = document.querySelectorAll('.board-box')
  let _playersDisplay = document.querySelectorAll('[player-display]');
  let _winnerDisplay = document.querySelector('#display-winner');
  let _playerOneScoreDisplay = document.querySelector('#player-score-1');
  let _playerTwoScoreDisplay = document.querySelector('#player-score-2');
  
  const _displayBoard = () => {
    _boardElem.forEach ((b, i) => {
      b.textContent = _board[i];
    });
  }

  const displayWinner = (text) => {
    _winnerDisplay.textContent = text;
  }

  const displayScore = (score) => {
    _playerOneScoreDisplay.textContent = score[0];
    _playerTwoScoreDisplay.textContent = score[1];
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

  const detectWin = () => {
    let cross1 = (_board[0] === _board[4] && _board[4] === _board[8] && _board[0] !== '');
    let cross2 = (_board[2] === _board[4] && _board[4] === _board[6] && _board[2] !== '');

    let vertical1 = (_board[0] === _board[3] && _board[3] === _board[6] && _board[0] !== '');
    let vertical2 = (_board[1] === _board[4] && _board[4] === _board[7] && _board[1] !== '');
    let vertical3 = (_board[2] === _board[5] && _board[5] === _board[8] && _board[2] !== '');

    let horizontal1 = (_board[0] === _board[1] && _board[1] === _board[2] && _board[0] !== '');
    let horizontal2 = (_board[3] === _board[4] && _board[4] === _board[5] && _board[3] !== '');
    let horizontal3 = (_board[6] === _board[7] && _board[7] === _board[8] && _board[6] !== '');

    if (cross1 || cross2 || vertical1 || vertical2 || vertical3 || horizontal1 || 
        horizontal2 || horizontal3) {
      return true;
    } else {
      return false;
    }
  };

  const isBoardFull = () => {
    for (let i = 0; i < _board.length; i++) {
      if (_board[i] === '') {
        return false;
      }
    }

    return true;
  }

  return {setBoard, toggleDisplay, emptyBoard, detectWin, displayWinner, displayScore, isBoardFull};
})();

const makePlayer = (playerName, mark = 'O') => {
  const takeTurn = (pos) => {
    let turn = gameBoard.setBoard(pos, mark);
    return turn;
  }

  if (mark === 'O') {
    document.querySelector('#player-name-1').textContent = playerName;
  } else {
    document.querySelector('#player-name-2').textContent = playerName;
  }

  return {takeTurn};
};

const gameMaster = (() => {
  let _playerOneName = prompt('Player 1 Name?', 'Player 1');
  let _playerTwoName = prompt('Player 2 Name?', 'Player 2');
  _playerOneName = (_playerOneName === null) ? 'Player 1' : _playerOneName;
  _playerTwoName = (_playerTwoName === null) ? 'Player 2' : _playerTwoName;
  let _round = 1;
  let _playersScore = [0, 0];

  let _players = [makePlayer(_playerOneName, 'O'), makePlayer(_playerTwoName, 'X')];
  let _currentTurn = 0;
  let _isGameRunning = true;

  const _nextTurn = () => {
    if (_currentTurn === 0) {
      _currentTurn = 1;
    } else {
      _currentTurn = 0;
    }
  };

  const _endGame = () => {
    let msg = `${(_currentTurn === 0) ? _playerOneName : _playerTwoName} Wins!`;
    _playersScore[_currentTurn]++;
    gameBoard.displayWinner(msg);
    gameBoard.displayScore(_playersScore);
    _isGameRunning = false;
  };

  const takeTurn = (pos) => {
    if (!_isGameRunning) return;

    let turn = _players[_currentTurn].takeTurn(pos);
    if (turn) {
      if (gameBoard.isBoardFull()) {
        gameBoard.displayWinner('Tie!');
      }

      if (gameBoard.detectWin()) {
        _endGame();
        return;
      }

      _nextTurn();
      gameBoard.toggleDisplay(_currentTurn);
    }
  };

  const reset = () => {
    _currentTurn = 0;
    gameBoard.emptyBoard();
    gameBoard.displayWinner('');
    gameBoard.displayScore([0, 0]);
    gameBoard.toggleDisplay(_currentTurn);
    _round = 1;
    _playersScore = [0, 0];
    _isGameRunning = true;
  };

  const nextRound = () => {
    _round++;
    _currentTurn = (_round % 2 === 0) ? 1 : 0;
    gameBoard.emptyBoard();
    gameBoard.displayWinner('');
    gameBoard.toggleDisplay(_currentTurn);
    _isGameRunning = true;
  };

  return {takeTurn, reset, nextRound};
})();

document.querySelectorAll('.board-box').forEach ((b) => {
  b.addEventListener('click', () => { gameMaster.takeTurn(b.getAttribute('pos')) });
})


