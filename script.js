const socket = io();

const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');

const updateBoard = (gameState) => {
    gameState.board.forEach((value, index) => {
        cells[index].textContent = value;
        cells[index].style.color = value === 'X' ? '#ff007f' : '#00bfff';
    });

    if (gameState.winner) {
        message.textContent = gameState.winner === 'Draw' ? "It's a Draw!" : `Player ${gameState.winner} Wins!`;
    } else {
        message.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    }
};

const handleClick = (event) => {
    const index = event.target.getAttribute('data-index');
    socket.emit('makeMove', index);
};

const resetGame = () => {
    socket.emit('resetGame');
};

board.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);

socket.on('updateGame', updateBoard);
