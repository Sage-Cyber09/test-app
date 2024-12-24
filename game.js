const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let player = {
    x: 50,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false
};

let obstacles = [];
let frame = 0;
let score = 0;
let obstacleTypes = ['dog', 'car'];

function update() {
    frame++;
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    // Check for collisions
    if (checkCollision()) {
        alert("TRY AGAIN");
        resetGame();
    }

    if (frame % 100 === 0) {
        let type = obstacleTypes[frame / 100 % 2];
        let y = canvas.height - 50; // Default y position for block
        if (type === 'dog') {
            y = canvas.height - 40; // Adjust y position for dog
        } else if (type === 'car') {
            y = canvas.height - 30; // Adjust y position for car
        }
        obstacles.push({
            x: canvas.width,
            y: y,
            width: 50,
            height: 50,
            type: type
        });
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= player.speed;
    });

    obstacles = obstacles.filter(obstacle => {
        if (obstacle.x + obstacle.width > 0) {
            return true;
        } else {
            score++;
            return false;
        }
    });
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    player.x = 50;
    player.y = canvas.height - 60;
    player.dy = 0;
    frame = 0;
    obstacles = [];
    score = 0;
}

function drawDog(x, y) {
    ctx.fillStyle = 'brown';
    ctx.fillRect(x, y+10, 50, 30); // Body

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 10, y, 10, 0, Math.PI * 2); // Head
    ctx.fill();

    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 15, y - 20);
    ctx.lineTo(x + 20, y);
    ctx.closePath();
    ctx.fill(); // Ears

    ctx.fillStyle = 'black';
    ctx.fillRect(x + 35, y + 10, 10, 20); // Tail
}

function drawCar(x, y) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 50, 20); // Body

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + 10, y + 20, 10, 0, Math.PI * 2); // Front wheel
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 40, y + 20, 10, 0, Math.PI * 2); // Rear wheel
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cat (player)
    ctx.fillStyle = 'gray';
    ctx.fillRect(player.x, player.y, player.width, player.height); // Body

    // Ears
    ctx.beginPath();
    ctx.moveTo(player.x + 5, player.y);
    ctx.lineTo(player.x + 15, player.y - 20);
    ctx.lineTo(player.x + 25, player.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(player.x + 25, player.y);
    ctx.lineTo(player.x + 35, player.y - 20);
    ctx.lineTo(player.x + 45, player.y);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(player.x + 35, player.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 20, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(player.x + 35, player.y + 20, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.arc(player.x + 25, player.y + 30, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw obstacles
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'dog') {
            drawDog(obstacle.x, obstacle.y);
        } else if (obstacle.type === 'car') {
            drawCar(obstacle.x, obstacle.y);
        }
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player.grounded) {
        player.dy = player.jumpPower;
    }
});

gameLoop();