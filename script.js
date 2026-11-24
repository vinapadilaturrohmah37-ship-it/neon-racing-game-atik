
const loginPage = document.getElementById("loginPage");
const menuPage = document.getElementById("menuPage");
const gamePage = document.getElementById("gamePage");
const gameOverPage = document.getElementById("gameOverPage");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let running = false;
let animationId = null;
let playerX = 160;
let obstacles = [];
let roadLine = 0;
let speed = 4;

const playerWidth = 40;
const playerHeight = 65;

function showPage(page) {
    [loginPage, menuPage, gamePage, gameOverPage]
        .forEach(p => p.classList.add("hidden"));

    page.classList.remove("hidden");
}

// LOGIN
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    // Login demo, bukan sistem keamanan untuk aplikasi produksi
    if (username === "player" && password === "12345") {
        document.getElementById("playerName").textContent = username;
        loginMessage.textContent = "";
        loginForm.reset();
        showPage(menuPage);
    } else {
        loginMessage.textContent = "Username atau password salah!";
    }
});

// LOGOUT
document.getElementById("logoutButton").addEventListener("click", () => {
    stopGame();
    showPage(loginPage);
});

// START GAME
document.getElementById("startButton").addEventListener("click", startGame);

function startGame() {
    stopGame();

    score = 0;
    speed = 4;
    playerX = 160;
    obstacles = [];
    roadLine = 0;

    document.getElementById("score").textContent = score;

    showPage(gamePage);

    running = true;
    gameLoop();
}

// GAMBAR MOBIL
function drawCar(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 10, playerWidth, playerHeight - 15);

    ctx.fillStyle = "#222";
    ctx.fillRect(x + 5, y, 30, 20);

    ctx.fillStyle = "#9be7ff";
    ctx.fillRect(x + 7, y + 3, 26, 12);

    ctx.fillStyle = "#111";
    ctx.fillRect(x - 4, y + 18, 5, 15);
    ctx.fillRect(x + 39, y + 18, 5, 15);
    ctx.fillRect(x - 4, y + 45, 5, 15);
    ctx.fillRect(x + 39, y + 45, 5, 15);
}

// GAMBAR JALAN
function drawRoad() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, 360, 550);

    ctx.fillStyle = "#fff";
    ctx.fillRect(12, 0, 5, 550);
    ctx.fillRect(343, 0, 5, 550);

    roadLine += speed;

    if (roadLine > 60) roadLine = 0;

    for (let y = -60; y < 550; y += 60) {
        ctx.fillStyle = "#eee";
        ctx.fillRect(118, y + roadLine, 5, 30);
        ctx.fillRect(238, y + roadLine, 5, 30);
    }
}

// RINTANGAN
function createObstacle() {
    const lanes = [60, 160, 260];

    obstacles.push({
        x: lanes[Math.floor(Math.random() * lanes.length)],
        y: -70
    });
}

// GAME LOOP
let frame = 0;

function gameLoop() {
    if (!running) return;

    ctx.clearRect(0, 0, 360, 550);

    drawRoad();

    frame++;

    if (frame % 65 === 0) {
        createObstacle();
    }

    // Mobil pemain
    drawCar(playerX, 455, "#8d4dff");

    // Rintangan
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];

        obs.y += speed;

        drawCar(obs.x, obs.y, "#ff4141");

        // Deteksi tabrakan
        if (
            playerX < obs.x + 40 &&
            playerX + 40 > obs.x &&
            455 < obs.y + 65 &&
            520 > obs.y
        ) {
            endGame();
            return;
        }

        // Skor
        if (obs.y > 550) {
            obstacles.splice(i, 1);
            score += 10;

            document.getElementById("score").textContent = score;

            if (score % 50 === 0) {
                speed += 0.3;
            }
        }
    }

    animationId = requestAnimationFrame(gameLoop);
}

// KONTROL MOBIL
function moveLeft() {
    if (running) {
        playerX = Math.max(25, playerX - 30);
    }
}

function moveRight() {
    if (running) {
        playerX = Math.min(295, playerX + 30);
    }
}

document.getElementById("leftButton")
    .addEventListener("click", moveLeft);

document.getElementById("rightButton")
    .addEventListener("click", moveRight);

// KEYBOARD
document.addEventListener("keydown", function(e) {
    if (!running) return;

    if (e.key === "ArrowLeft" || e.key === "a") {
        moveLeft();
    }

    if (e.key === "ArrowRight" || e.key === "d") {
        moveRight();
    }
});

// GAME OVER
function endGame() {
    running = false;

    document.getElementById("finalScore").textContent = score;

    showPage(gameOverPage);
}

// STOP GAME
function stopGame() {
    running = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// MAIN LAGI
document.getElementById("restartButton")
    .addEventListener("click", startGame);

// KEMBALI KE MENU
document.getElementById("backMenu")
    .addEventListener("click", () => {
        stopGame();
        showPage(menuPage);
    });

// KELUAR DARI GAME
document.getElementById("exitGame")
    .addEventListener("click", () => {
        stopGame();
        showPage(menuPage);
    });
