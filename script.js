const Gameboard = (function() {
    let gameboard = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    return {
        gameboard
    }
})();

const Player = function(name, mark) {
    function placeMark(tileIndex) {
        for (let i = 0; i < Gameboard.gameboard.length; i++) {
            if(parseInt(tileIndex) === i) {
                if(Gameboard.gameboard[i] === '') {
                    Gameboard.gameboard[i] = mark;
                }
            }
        }
        displayController.renderBoard();
    }

    return {
        name,
        mark,
        placeMark
    }
}

const displayController = (function() {
    const startScreen = document.querySelector('.start-screen');
    const gameScreen = document.querySelector('.game-screen');
    const currentPlayerText = document.querySelector('.current-player');
    const endScreen = document.querySelector('.overlay');

    const tiles = document.querySelectorAll('.gameboard__tile');

    const playerOneInput = document.querySelector('#player-one');
    const playerTwoInput = document.querySelector('#player-two');

    const startButton = document.querySelector('.start-button');
    const restartButton = document.querySelector('.restart-button');

    function renderStartScreen() {
        startScreen.style.display = 'block';
    }

    function renderGameScreen() {
        startScreen.style.display = 'none'
        gameScreen.style.display = 'block';
    }

    function renderEndScreen(result) {
        endScreen.style.display = 'flex';

        const gameResult = document.querySelector('.game-result-text');
        gameResult.textContent = result;
    }

    function renderBoard() {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].innerHTML = Gameboard.gameboard[i];
        }
    }

    return {
        renderStartScreen,
        renderGameScreen,
        renderBoard,
        renderEndScreen,
        tiles,
        startButton,
        restartButton,
        playerOneInput,
        playerTwoInput,
        currentPlayerText
    }
})();

const game = (function() {
    let playerOne;
    let playerTwo;
    let currentPlayer;
    let currentPlayerText = displayController.currentPlayerText;
    let moves = 0;
    let result;

    displayController.startButton.addEventListener('click', startGame);
    
    displayController.tiles.forEach(tile => tile.addEventListener('click', function play() {

        currentPlayer.placeMark(tile.getAttribute('data-index'));
        moves++;
        result = checkWin(currentPlayer.mark, moves) || 'pending';
        currentPlayer = togglePlayer(currentPlayer, playerOne, playerTwo);
        currentPlayerText.textContent = currentPlayer.name;
        this.removeEventListener('click', play);
        console.log(moves);

        if(result !== 'pending') {
            endGame(result);
        }

    }));

    displayController.restartButton.addEventListener('click', () => location.reload());
    
    function startGame() {
        let playerOneName = displayController.playerOneInput.value.trim();
        let playerTwoName = displayController.playerTwoInput.value.trim();

        playerOne = playerOneName !== '' ? Player(playerOneName, 'X') : Player('X', 'X');
        playerTwo = playerTwoName !== '' ? Player(playerTwoName, 'O') : Player('O', 'O');
        currentPlayer = playerOne;
        currentPlayerText.textContent = currentPlayer.name;

        displayController.renderGameScreen();
    }

    function togglePlayer(currentP, p1, p2) {
        if(currentP === p1) {
            currentP = p2;
        }
        else {
            currentP = p1;
        }
        return currentP;
    }

    // check for win or tie (brute force solution)
    function checkWin(mark, moves) {
        let board = Gameboard.gameboard;
        let winMessage = '';

        // rows
        if((board[0] === mark && board[1] === mark && board[2] === mark) ||
        (board[3] === mark && board[4] === mark && board[5] === mark) ||
        (board[6] === mark && board[7] === mark && board[8] === mark) ||

        // cols
        (board[0] === mark && board[3] === mark && board[6] === mark) ||
        (board[1] === mark && board[4] === mark && board[7] === mark) ||
        (board[2] === mark && board[5] === mark && board[8] === mark) ||

        // diag
        (board[0] === mark && board[4] === mark && board[8] === mark) ||
        
        // opp diag
        (board[2] === mark && board[4] === mark && board[6] === mark))
        
        {
            winMessage = `${currentPlayer.name.toUpperCase()} WINS!`;
            return winMessage;
        }

        if(moves === 9 && winMessage === '') {
            return 'IT\'S A TIE';
        }

    };

    function endGame(result) {
        displayController.renderEndScreen(result);
        currentPlayerText.textContent = '';
    }
})();

window.onload = function() {
    displayController.renderStartScreen();
}