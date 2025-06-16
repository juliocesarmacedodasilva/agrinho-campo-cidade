

let player;
let obstacles = [];
let items = [];
let roadY;
let score = 0;
let gameState = "start"; // "start", "play", "win", "gameOver"

function setup() {
  createCanvas(800, 400);
  roadY = height / 2 + 50;
  player = new Player();
  generateGameObjects();
}

function draw() {
  background(100, 200, 255); // Céu azul

  drawField();
  drawRoad();
  drawCity();

  if (gameState === "start") {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("🌾 Festejando a Conexão Campo-Cidade 🏙️", width / 2, 100);
    textSize(18);
    text("Use as setas ↑ e ↓ para se mover", width / 2, 150);
    text("Colete os itens amarelos e evite os obstáculos marrons!", width / 2, 180);
    text("Pressione ESPAÇO para começar", width / 2, 220);
    return;
  }

  if (gameState === "play") {
    player.update();
    player.show();

    for (let obs of obstacles) {
      obs.update();
      obs.show();
      if (player.hits(obs)) {
        gameState = "gameOver";
      }
    }

    for (let i = items.length - 1; i >= 0; i--) {
      items[i].update();
      items[i].show();
      if (player.collect(items[i])) {
        score++;
        items.splice(i, 1);
      }
    }

    if (player.x >= width - 60) {
      gameState = "win";
    }

    fill(0);
    textSize(18);
    textAlign(LEFT);
    text("Pontuação: " + score, 10, 20);
  }

  if (gameState === "gameOver") {
    fill("red");
    textSize(36);
    textAlign(CENTER);
    text("Game Over 💥", width / 2, height / 2);
    textSize(18);
    text("Pressione R para reiniciar", width / 2, height / 2 + 40);
  }

  if (gameState === "win") {
    drawFireworks();
    fill("green");
    textSize(32);
    textAlign(CENTER);
    text("🎉 Você chegou à cidade! 🎉", width / 2, height / 2);
    textSize(20);
    text("Pontuação final: " + score, width / 2, height / 2 + 40);
    text("Pressione R para jogar novamente", width / 2, height / 2 + 70);
  }
}

// ===== Classes =====
class Player {
  constructor() {
    this.x = 50;
    this.y = roadY;
    this.w = 40;
    this.h = 30;
  }

  update() {
    if (keyIsDown(UP_ARROW)) this.y -= 5;
    if (keyIsDown(DOWN_ARROW)) this.y += 5;
    this.y = constrain(this.y, roadY - 40, roadY + 40);
    this.x += 2;
  }

  show() {
    fill("orange");
    rect(this.x, this.y, this.w, this.h);
  }

  hits(obstacle) {
    return collideRectRect(this.x, this.y, this.w, this.h, obstacle.x, obstacle.y, obstacle.w, obstacle.h);
  }

  collect(item) {
    return collideRectRect(this.x, this.y, this.w, this.h, item.x, item.y, item.size, item.size);
  }
}

class Obstacle {
  constructor(x) {
    this.x = x;
    this.y = random(roadY - 30, roadY + 30);
    this.w = 30;
    this.h = 30;
  }

  update() {
    this.x -= 2;
  }

  show() {
    fill("brown");
    rect(this.x, this.y, this.w, this.h);
  }
}

class Item {
  constructor(x) {
    this.x = x;
    this.y = random(roadY - 20, roadY + 20);
    this.size = 20;
  }

  update() {
    this.x -= 2;
  }

  show() {
    fill("yellow");
    ellipse(this.x, this.y, this.size);
  }
}

// ===== Visuais =====
function drawField() {
  fill(34, 139, 34);
  rect(0, height / 2, width / 2, height / 2);
  fill(255, 204, 0);
  ellipse(100, 80, 80); // Sol
}

function drawRoad() {
  fill(60);
  rect(0, roadY - 20, width, 60);
  stroke(255);
  strokeWeight(2);
  for (let i = 0; i < width; i += 40) {
    line(i, roadY + 10, i + 20, roadY + 10);
  }
  noStroke();
}

function drawCity() {
  fill(100);
  rect(width - 100, height / 2 - 80, 80, 160);
  fill(0);
  rect(width - 80, height / 2 - 60, 10, 20);
  rect(width - 60, height / 2 - 40, 10, 20);
}

function drawFireworks() {
  for (let i = 0; i < 10; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height / 2), 10, 10);
  }
}

function generateGameObjects() {
  obstacles = [];
  items = [];
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle(random(400, 1600)));
    items.push(new Item(random(400, 1600)));
  }
}

// ===== Colisão =====
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 < x2 + w2 &&
          x1 + w1 > x2 &&
          y1 < y2 + h2 &&
          y1 + h1 > y2);
}

// ===== Teclado =====
function keyPressed() {
  if (key === ' ' && gameState === "start") {
    gameState = "play";
  }
  if (key === 'r' || key === 'R') {
    score = 0;
    player = new Player();
    generateGameObjects();
    gameState = "play";
  }
}

