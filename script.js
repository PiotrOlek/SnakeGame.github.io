const canvas = document.getElementById('snake-game');
const ctx = canvas.getContext('2d');
const blockSize = 20;
const maxBlocks = canvas.width / blockSize;
let direction = 'right';
let snake, food, score;
let gameStarted = false;

const playButton = document.getElementById('play-button');
const scoreElement = document.getElementById('score');

playButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        playButton.disabled = true;
        startGame();
    } else {
        resetGame();
        startGame();
    }
});

function startGame() {
    snake = [
        { x: Math.floor(maxBlocks / 2), y: Math.floor(maxBlocks / 2) },
        { x: Math.floor(maxBlocks / 2 - 1), y: Math.floor(maxBlocks / 2) },
        { x: Math.floor(maxBlocks / 2 - 2), y: Math.floor(maxBlocks / 2) }
    ];
    score = 0;
    scoreElement.textContent = 'Score: 0';

    spawnFood();
    main();
}

function resetGame() {
    direction = 'right';
    gameStarted = false;
    playButton.disabled = false;
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (!gameStarted) return;
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (!gameStarted) return;
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (!gameStarted) return;
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (!gameStarted) return;
            if (direction !== 'left') direction = 'right';
            break;
    }
});

function main() {
    setTimeout(() => {
        if (!gameStarted) return;
        moveSnake();
        drawBoard();
        drawSnake();
        drawFood();
        main();
    }, 200);
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = 'Score: ' + score;
        spawnFood();
    } else {
        snake.pop();
    }

    if (isCollision(head)) {
        alert('Game Over! Score: ' + score);
        resetGame();
    } else {
        snake.unshift(head);
    }
}

function isCollision(head) {
    return (
        head.x < 0 ||
        head.x >= maxBlocks ||
        head.y < 0 ||
        head.y >= maxBlocks ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function drawBoard() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'lime';

    for (const segment of snake) {
        ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * maxBlocks),
        y: Math.floor(Math.random() * maxBlocks)
    };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        spawnFood();
    }
}

startGame();
