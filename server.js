const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let gameState = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    winner: null,
};

const checkWinner = (board) => {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'Draw';
};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('updateGame', gameState);

    socket.on('makeMove', (index) => {
        if (gameState.board[index] === '' && !gameState.winner) {
            gameState.board[index] = gameState.currentPlayer;
            gameState.winner = checkWinner(gameState.board);
            gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
            io.emit('updateGame', gameState);
        }
    });

    socket.on('resetGame', () => {
        gameState = {
            board: Array(9).fill(''),
            currentPlayer: 'X',
            winner: null,
        };
        io.emit('updateGame', gameState);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
