const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個 canvas 的 drawind context
// drawind context可以用來在canvas內畫圈。

// 框架單位
const unit = 20;
const row = canvas.height / unit; // 500 / 20 = 25
const column = canvas.width / unit; // 500 / 20 = 25

// 製作蛇
const snake = []; //array中的每個元素都是一個物件，用來儲存身體的x,y座標。

function createSnake() {
  snake[0] = {
    x: 80,
    y: 100,
  };
  snake[1] = {
    x: 60,
    y: 100,
  };
  snake[2] = {
    x: 40,
    y: 100,
  };
  snake[3] = {
    x: 20,
    y: 100,
  };
}

// 果實設定
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickAlocation() {
    let overlapping = false; //設定一個果實重疊的變數
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x === snake[i].x && new_y === snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//初始設定
createSnake();
let myFruit = new Fruit();

// ------------------------方向鍵設定---------------------------------

document.addEventListener("keydown", changeDirection);

let d = "Right";

function changeDirection(event) {
  if (event.key === "a" && d != "Right") {
    d = "Left";
  } else if (event.key === "s" && d != "Up") {
    d = "Down";
  } else if (event.key === "d" && d != "Left") {
    d = "Right";
  } else if (event.key === "w" && d != "Down") {
    d = "Up";
  }

  //預防下一幀出來之前，重複keydown導致蛇邏輯上自殺
  document.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();

let score = 0;
document.getElementById("myScore").innerHTML = "Score :" + " " + score;
document.getElementById("myScore2").innerHTML =
  "HighestScore :" + " " + highestScore * 10;

// ------------------------畫出蛇和果實------------------------------

function draw() {
  // 每次畫圖前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      clearInterval(myGame);
      alert("Game Over!");
      return;
    }
  }

  //背景設為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.fillStyle = "orange"; //蛇頭
    } else {
      ctx.fillStyle = "green"; //蛇身
    }
    ctx.strokeStyle = "black"; //外框

    //穿牆
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //   x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前的d變動方向，來決定蛇的下一幀放在哪個座標
  let snakeX = snake[0].x; //snake[0]是物件，snake[0].x是個number
  let snakeY = snake[0].y;
  if (d === "Left") {
    snakeX -= unit;
  } else if (d === "Up") {
    snakeY -= unit;
  } else if (d === "Right") {
    snakeX += unit;
  } else if (d === "Down") {
    snakeY += unit;
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x === myFruit.x && snake[0].y === myFruit.y) {
    // 重新選定一個果實位置
    myFruit.pickAlocation();
    // 畫出新果實
    myFruit.drawFruit();
    // 更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "Score :" + " " + score * 10;
    document.getElementById("myScore2").innerHTML =
      "HighestScore :" + " " + highestScore * 10;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  document.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 80);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") === null) {
    highestScore = 0;
  } else {
    // loadHighestScore.getItem("highestScore")返回值是一個String，
    // 所以要＋Number!!!!!!
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
