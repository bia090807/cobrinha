const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

const box = 20;
let snake, direction, food, score, changingDirection, gameSpeed;

function startNewGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = generateFood();
    score = 0;
    scoreElement.textContent = score;
    changingDirection = false;
    gameSpeed = 180;

    // Hide the restart button and restart the game loop
    restartButton.style.display = "none";
    gameLoop();
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function checkCollision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function gameLoop() {
    if (!update()) return;
    draw();
    changingDirection = false;
    setTimeout(gameLoop, gameSpeed);
}

function update() {
    let head = { x: snake[0].x, y: snake[0].y };
    
    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;
    
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        checkCollision(head, snake)
    ) {
        showGameOver();
        return false;
    }
    
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score += 10;
        scoreElement.textContent = score;
    } else {
        snake.pop();
    }
    
    snake.unshift(head);
    return true;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
    
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });
}

function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação Final: " + score, canvas.width / 2, canvas.height / 2 + 20);
    
    // Show the restart button
    restartButton.style.display = "block";
}

// Add an event listener to the button to restart the game
restartButton.addEventListener("click", startNewGame);

// Start a new game when the page loads
startNewGame();
