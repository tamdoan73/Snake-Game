$(document).ready(function() {
    // CANVAS PART
    var canvas = $("#canvas")[0];
    var canvasContext = canvas.getContext("2d");
    var canvasWidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();
  
    // CREATING THE SNAKE
    var snakeWidth = 15;
    var direction;
    var food;
    var snake;
    var score;
    var speed = 150;
    var loop_game;
    // CREATING THE IMAGE FOR THE APPLE
    const foodImg = new Image();
    foodImg.src = "img/food.png";
 
    // BUTTON FUNCTIONS
    $(".start").click(function(event) {
      startGame();
      $("#canvas").css("visibility", "100");
      $(".start").css("display", "none");
      $(".reset").css("display", "inline-block");
    });
    $(".reset").click(function(event) {
      startGame();
      $(".start").css("display", "none");
      $(".resume").css("display", "none");
      $(".pause").css("display", "inline-block");
      $(".reset").css("display", "inline-block");
  
    });
    $(".resume").click(function(event) {
      loop_game = setInterval(render, 60);
      $(".start").css("display", "none");
      $(".pause").css("display", "inline-block");
      $(".resume").css("display", "none");
      $(".reset").css("display", "inline-block");
    });
    $(".pause").click(function(event) {
      clearInterval(loop_game);
      $(".start").css("display", "none");
      $(".resume").css("display", "inline-block");
      $(".pause").css("display", "none");
      $(".reset").css("display", "inline-block");
      $(".playAgain").css("display", "none");
    });
    $(".playAgain").click(function(event) {
      startGame();
      $("#canvas").css("visibility", "100");
      $(".game").css("display", "inline-block");
      $(".notification").css("display", "none");
      $(".start").css("display", "inline-block");
      $(".resume").css("display", "none");
      $(".pause").css("display", "inline-block");
      $(".reset").css("display", "none");
      $(".playAgain").css("display", "none");
    });

    // load audio files

    let dead = new Audio();
    let eat = new Audio();
    let up = new Audio();
    let right = new Audio();
    let left = new Audio();
    let down = new Audio();

    dead.src = "audio/dead.mp3";
    eat.src = "audio/eat.mp3";
    up.src = "audio/up.mp3";
    right.src = "audio/right.mp3";
    left.src = "audio/left.mp3";
    down.src = "audio/down.mp3";

  
       /*
      function speed to determine the initial speed for the game
    */
   function runGame(newSpeed) {
    clearInterval(loop_game);
    loop_game = setInterval(render, newSpeed);
  }

  function startGame() {
    // initial the score as 0 
    score = 0;
    // initial the direction of the snake as RIGHT direction
    direction = "right";
    snakeMake();
    randomGoods();
    runGame(speed);
  }
    // create the snake
    function snakeMake() {
      var length = 5;
      // initalize the snake as an array
      snake = [];
      for (var i = length - 1; i >= 0; i--) {
        snake.push({
          x: i,
          y: 0
        });
      };
    }
    
    // create the food
    function randomGoods() {
      food = {
        x: Math.round(Math.random() * (canvasWidth - snakeWidth) / snakeWidth),
        y: Math.round(Math.random() * (canvasHeight - snakeWidth) / snakeWidth),
      }
    }
  
    function render() {
      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
      canvasContext.strokeStyle = "black";
      canvasContext.strokeRect(0, 0, canvasWidth, canvasHeight);
  
      // Making the snake move.
      var newX = snake[0].x;
      var newY = snake[0].y;
      //var tail;
      //var color;
  
      if (direction === "right") {
        newX++;
      } else if (direction === "left") {
        newX--;
      } else if (direction === "up") {
        newY--;
      } else if (direction === "down") {
        newY++;
      }
      // GAME OVER CONDITION
      if (newX === -1 || newX === canvasWidth / snakeWidth || newY === -1 || newY === canvasHeight / snakeWidth || collide(newX, newY, snake)) {
        $(".game").css("display", "none");
        $(".notification").css("display", "inline-block");
        $(".start").css("display", "none");
        $(".resume").css("display", "none");
        $(".pause").css("display", "none");
        $(".reset").css("display", "none");
        $(".playAgain").css("display", "inline-block");
        $(".score").text("TOTAL SCORE: " + score);
        dead.play();
        return;
      }
  
      if (newX === food.x && newY === food.y) {
       /* tail = {
          x: newX,
          y: newY
        };*/
        score++;
        eat.play();
        $(".currentScore").text("Your score: " + score);
        randomGoods();
        if (speed > 10) { 
          speed -= 10;
          runGame(speed);
        }
      } else {
        // now remove the tail
        snake.pop()
      }
        // add new head to the snake
        var newHead = {
          x: newX,
          y: newY
        }
      snake.unshift(newHead); //move the end of the snake to the head to make it move

      
      /* Coloring each array of the snake
      and adding a white stroke so it looks like a solid snake*/
      for (var i = 0; i < snake.length; i++) {
        color = snake[i];
        randomFood(color.x, color.y);
  
      };
      randomFood(food.x, food.y)
    }
  
    function randomFood(x, y) {
      canvasContext.fillStyle = "white";
      canvasContext.fillRect(x * snakeWidth, y * snakeWidth, snakeWidth, snakeWidth);
      canvasContext.strokeStyle = "red";
      canvasContext.strokeRect(x * snakeWidth, y * snakeWidth, snakeWidth, snakeWidth);
    }
  
    // check for collision with its own
    function collide(x, y, array) {
      for (var i = 0; i < array.length; i++) {
        if (x === array[i].x && y === array[i].y)
          return true;
      }
      return false;
    }
  
    $(document).keydown(function(event) {
      var arrow = event.which; // return which key was pressed
      if (arrow === 37 && direction !== "right") {
        direction = "left";
        left.play();
      } else if (arrow === 38 && direction !== "down") {
        direction = "up";
        up.play();
      } else if (arrow === 39 && direction !== "left") {
        direction = "right";
        right.play();
      } else if (arrow === 40 && direction !== "up") {
        direction = "down";
        down.play();
      }
    });
  });