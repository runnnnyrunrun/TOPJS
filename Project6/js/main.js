/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  /* MAIN GAME OBJECT */
  var MineSweeper = (function () {
    
    // FIELD CONSTRUCTOR
    var Field = function (x, y) {
      this.x = x;
      this.y = y;
      this.bomb = false;
      this.minesAround = 0;
      this.isFlagged = false;
      this.isRevealed = false;
    };
        
    // VARIABLES
    var adjacent = [[-1, -1], [-1, 0], [0, -1], [1, 1], [1, 0], [0, 1], [1, -1], [-1, 1]],
        board = [],
        currentField,
        fieldNumber,
        gameField = $('#fields'),
        randomCounter,
        splashScreen = $('<section id="splash" class="game-start"><p>PLAY</p></section>'),
        splashContent = {
          'lose': 'GAME OVER<br>CLICK TO PLAY AGAIN',
          'win': 'CONGRATULATIONS!<br>FIELD CLEARED<br>CLICK TO PLAY AGAIN'
        },
        tempBombs,
        tempField;
    
    // METHODS
    var countAdjacent,
        fieldOnBoard,
        flagToggle,
        generateBoard,
        generateBombs,
        initialize,
        render,
        resetBoard,
        reveal,
        revealEmpty,
        winCheck;
    
    countAdjacent = function () {
      $.each(tempBombs, function (i, bombFieldNumber) {
        var x = board[bombFieldNumber].x,
            y = board[bombFieldNumber].y;
        
        $.each(adjacent, function (j, v) {
          if (x + v[0] >= 0 && x + v[0] < 9 && y + v[1] >= 0 && y + v[1] < 9) {
            board[(x + v[0]) + (y + v[1]) * 9].minesAround++;
          }
        });
      });
    };
    
    fieldOnBoard = function (x, y, v) {
      return (x + v[0] >= 0 && x + v[0] < 9 && y + v[1] >= 0 && y + v[1] < 9);
    };
    
    flagToggle = function (field) {
      fieldNumber = $(field).data('field-number');
      board[fieldNumber].isFlagged = !board[fieldNumber].isFlagged;
      $(field).toggleClass('flagged');
    };
    
    generateBoard = function () {
      resetBoard();
      generateBombs();
      countAdjacent();
      render();
    };
    
    generateBombs = function () {
      tempBombs = [];
      var i = 0;
      while (i <= 9) {
        randomCounter = Math.floor(Math.random() * 81);
        if (tempBombs.indexOf(randomCounter) === -1) {
          tempBombs.push(randomCounter);
          board[randomCounter].bomb = true;
          i++;
        }
      }
    };
    
    render = function () {
      gameField.empty();
      $.each(board, function (i, v) {
        tempField = $('<div>').data('field-number', i);
        if (!v.isRevealed) {
          tempField.addClass('hidden');
          if (v.isFlagged) {
            tempField.addClass('flagged');
          }
        }
        if (v.bomb && v.isRevealed) {
          tempField.addClass('failure');
        } else if (v.minesAround > 0) {
          tempField.text(v.minesAround);
        }
        gameField.append(tempField);
      });
      gameField.append(splashScreen);
    };
    
    resetBoard = function () {
      board = [];
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          tempField = new Field(j, i);
          board.push(tempField);
        }
      }
    };
    
    reveal = function (field) {
      board[field].isRevealed = true;
    };
    
    revealEmpty = function (field) {
      var x = board[field].x;
      var y = board[field].y;
      
      reveal(field);
      $.each(adjacent, function (i, v) {
        if (fieldOnBoard(x, y, v)) {
          var calculatedField = (x + v[0]) + (y + v[1]) * 9;
          currentField = board[calculatedField];
          if (!currentField.isRevealed && !currentField.bomb) {
            if (currentField.minesAround === 0) {
              revealEmpty(calculatedField);
            } else {
              reveal(calculatedField);
            }
          }
        }
      });
    };
    
    winCheck = function () {
      if (gameField.find('div.hidden').length === 10) {
        $('#splash').find('p').html(splashContent.win).end().fadeIn(2000);
      }
    };
    
    // INIT FUNCTION
    initialize = function () {
      // Generate clean board
      generateBoard();
      // Add event listeners
      $('#fields').on('click', '#splash', function (e) {
        generateBoard();
        $(this).fadeOut(1000);
      });
      gameField.on('click.gameMech', 'div.hidden', function () {
        $(this).removeClass('hidden');
        fieldNumber = $(this).data('field-number');
        if (!board[fieldNumber].bomb && board[fieldNumber].minesAround === 0) {
          revealEmpty(fieldNumber);
        } else if (board[fieldNumber].bomb) {
          $.each(tempBombs, function(i, v) {
            reveal(v);
          });
          $('#splash').find('p').html(splashContent.lose).end().fadeIn(2000);
        } else {
          reveal(fieldNumber);
        }
        render();
        winCheck();
      });
      gameField.on('contextmenu', 'div', function (e) {
        e.preventDefault();
      });
      gameField.on('contextmenu.gameMech', 'div.hidden', function (e) {
        flagToggle(this);
      });
    };
    
    return {
      play: initialize
    };
  }());
  
  MineSweeper.play();
});