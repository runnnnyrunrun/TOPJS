/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  /* MAIN GAME OBJECT */
  var SnakeGame = (function () {
    
    // CONSTANTS
    var GRIDSIZES = [10, 15, 20, 30],
        REACTIONS = ['Yummy!', 'Om nom nom', 'Brainzzz...', "Not fat, just bulkin'", 'They call me Jabba', 'Size matters', "No Samuel L. Jackson spotted", 'Diabeeetus...', 'NOT Piranhaconda'];
    
    // VARIABLES
    var endGameFlag,
        food,
        grid,
        gridsize,
        moveMaker,
        score,
        snake;
    
    // EMPTY GRID GENERATION
    var makeGrid = function (dimension) {
      var g = {};
      for (var i = 0; i<dimension; i++) {
        g[i] = [];
        for (var j = 0; j<dimension; j++) {
          g[i].push(" ");
        }
      }
      return g;
    };
    
    // SNAKE MOVEMENT LOGIC
    var move = function () {
      var oldx = snake.snakeBody[0][0],
          oldy = snake.snakeBody[0][1];
      
      switch (snake.direction) {
      case 'u':
        if (snake.snakeBody[0][1] === 0 || snakeEatSnake(oldx, oldy-1)) {
          endGame();
        } else {
          if (snake.snakeBody.size === 1) {
            snake.snakeBody[0][1] -= 1;
          } else {
            snake.snakeBody.unshift([oldx, oldy-1]);
            if (!ateFood()) {
              clearLastPart();
            } else {
              generateFood();
            }
          }
        }
        break;
      case 'r':
        if (snake.snakeBody[0][0] === gridsize - 1 || snakeEatSnake(oldx+1, oldy)) {
          endGame();
        } else {
          if (snake.snakeBody.size === 1) {
            snake.snakeBody[0][0] += 1;
          } else {
            snake.snakeBody.unshift([oldx+1, oldy]);
            if (!ateFood()) {
              clearLastPart();
            } else {
              generateFood();
            }
          }
        }
        break;
      case 'd':
        if (snake.snakeBody[0][1] === gridsize - 1 || snakeEatSnake(oldx, oldy+1)) {
          endGame();
        } else {
          if (snake.snakeBody.size === 1) {
            snake.snakeBody[0][1] += 1;
          } else {
            snake.snakeBody.unshift([oldx, oldy+1]);
            if (!ateFood()) {
              clearLastPart();
            } else {
              generateFood();
            }
          }
        }
        break;
      case 'l':
        if (snake.snakeBody[0][0] === 0 || snakeEatSnake(oldx-1, oldy)) {
          endGame();
        } else {
          if (snake.snakeBody.size === 1) {
            snake.snakeBody[0][0] -= 1;
          } else {
            snake.snakeBody.unshift([oldx-1, oldy]);
            if (!ateFood()) {
              clearLastPart();
            } else {
              generateFood();
            }
          }
        }
        break;
      }
      if (!endGameFlag) {
        renderSnake(oldx, oldy);
      }
    };
    
    // CHECKS IF SNAKE IS EATING HIMSELF
    var snakeEatSnake = function (x, y) {
      var lastPart = snake.snakeBody[snake.snakeBody.length - 1];
      return (/snake-tail/.test($('#board div')[y * gridsize + x].className) 
              && (lastPart[0] !== x) 
              && (lastPart[1] !== y)
             );
    };
    
    // CHECKS IF SNAKE HEAD IS ON FOOD
    var ateFood = function () {
      return (food.x === snake.snakeBody[0][0] && food.y === snake.snakeBody[0][1]);
    };
    
    // CREATE NEW FOOD
    var generateFood = function () {
      do {
        food.x = Math.floor(Math.random() * gridsize);
        food.y = Math.floor(Math.random() * gridsize);
      } 
      while($('#board div')[food.y * gridsize + food.x].className.search('snake') !== -1);
      
      renderFood();
      clearInterval(moveMaker);
      moveMaker = setInterval(move, (10000 / gridsize) - snake.snakeBody.length * 5);
      setScore();
    };
    
    var setScore = function () {
      var reaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      $('.main-info p').eq(0).html(reaction);
      score += snake.snakeBody.length * 10;
      $('.main-info span').eq(0).html('Weight: ' + score + ' lbs');
      setTimeout(function() {
        $('.main-info p').eq(0).html('---');
      }, 2000);
    };
    
    // DELETES LAST PART OF SNAKE FROM BOARD ON MOVE
    var clearLastPart = function () {
      var part = snake.snakeBody.pop();
      var fieldToClean = $('#board div').eq(part[1] * gridsize + part[0]).removeClass('snake-head snake-tail');
    };
    
    // EMPTY GRID RENDERING
    var renderBoard = function () {
      $('#board div').remove();
      $.each(grid, function (i, row) {
        $.each(row, function (j, col) {
          var field = $('<div/>', {
            'class': 'field field-' + gridsize,
            text: ' '
          });
          $('#board').append(field);
        });
      });
      $('#board').removeClass('field-10 field-15 field-20 field-30').addClass('field-' + gridsize);
    };
    
    // SNAKE RENDERING
    var renderSnake = function (x, y) {
      x = typeof x !== 'undefined' ? x : snake.snakeBody[0][0];
      y = typeof y !== 'undefined' ? y : snake.snakeBody[0][1];
      $('#board div').eq(y * gridsize + x).html = ' ';
      
      $.each(snake.snakeBody, function (i, v) {
        var snakePiece = $('#board div').eq(v[1] * gridsize + v[0]);
        if (i === 0) {
          snakePiece.removeClass('go-u go-d go-l go-r').addClass('snake-head go-' + snake.direction).removeClass('food');
        } else {
          snakePiece.removeClass('go-u go-d go-l go-r').addClass('snake-tail');
        }
      });
    };
    
    // FUNCTION ENDING THE GAME
    var endGame = function () {
      endGameFlag = true;
      clearInterval(moveMaker);
      $('.main-info p').eq(0).html('GAME OVER').addClass('gameover-2');
      $('#board').addClass('gameover');
    };
    
    // FUNCTION RENDERING FOOD
    var renderFood = function () {
      $('#board div').eq(food.y * gridsize + food.x).addClass('food');
    };
    
    // SET DIRECTION OF SNAKE
    var changeDirection = function (e) {
      e.preventDefault();
      switch (e.which) {
      case 38:
        if (snake.direction !== 'd') { snake.direction = 'u'; }
        break;
      case 39:
        if (snake.direction !== 'l') { snake.direction = 'r'; }
        break;
      case 40:
        if (snake.direction !== 'u') { snake.direction = 'd'; }
        break;
      case 37:
        if (snake.direction !== 'r') { snake.direction = 'l'; }
        break;
      }
    };
    $(document).on('keydown', changeDirection);
    
    // INIT FUNCTION
    var initialize = function () {
      endGameFlag = false;
      $('.main-info p').eq(0).html('---');
      var sizeRadio = $(':checked').val();
      gridsize = GRIDSIZES[sizeRadio];
      grid = makeGrid(gridsize);
      
      $('#board').removeClass('gameover');
      $('.main-info p').removeClass('gameover-2');
      renderBoard();
      
      food = {
        x: Math.floor(Math.random() * gridsize),
        y: Math.floor(Math.random() * gridsize)
      };
      renderFood();
      
      clearInterval(moveMaker);
      moveMaker = setInterval(move, 10000/gridsize);
      
      score = 0;
      $('.main-info span').eq(0).html('Weight: ' + score + ' lbs');
      snake = {
        direction: 'r',
        snakeBody: [[Math.floor(gridsize / 2), Math.floor(gridsize / 2)]]
      };
      renderSnake();
    };
    
    $('.new-game input').on('click', initialize);
    
    return {
      initialize: initialize
    };
  }());
  
  SnakeGame.initialize();
});