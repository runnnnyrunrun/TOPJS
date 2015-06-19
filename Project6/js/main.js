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
      this.isRevealed = false;
    };
        
    // VARIABLES
    var adjacent = [[-1, -1], [-1, 0], [0, -1], [1, 1], [1, 0], [0, 1], [1, -1], [-1, 1]],
        board = [],
        currentAdjacentField,
        currentField,
        fieldNumber,
        gameField = $('#fields'),
        randomCounter,
        tempBombs,
        tempField;
    
    // METHODS
    var countAdjacent,
        fieldOnBoard,
        generateBoard,
        generateBombs,
        initialize,
        isBomb,
        render,
        resetBoard,
        reveal,
        revealEmpty;
    
    countAdjacent = function () {
      $.each(tempBombs, function(i, bombFieldNumber) {
        var x = board[bombFieldNumber].x;
        var y = board[bombFieldNumber].y;
        
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
    
    isBomb = function (x, y) {
      return board[x + y * 9].bomb;
    };
    
    render = function () {
      gameField.empty();
      $.each(board, function(i, v) {
        tempField = $('<div>').data('field-number', i);
        if (!v.isRevealed) {
          tempField.addClass('hidden');
        }
        if (v.bomb) {
          tempField.text('B');
        } else if (v.minesAround > 0) {
          tempField.text(v.minesAround);
        }
        gameField.append(tempField);
      });
    };
    
    reveal = function (field) {
      board[field].isRevealed = true;
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
    
    revealEmpty = function (field) {
      var x = board[field].x;
      var y = board[field].y;
      
      reveal(field);
      $.each(adjacent, function(i, v) {
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
//      $.each([-10, -9, -8, -1, 1, 8, 9, 10], function(i, v) {
//        currentField = board[field + v];
//        if (field + v >= 0 && field + v < 81 && !currentField.isRevealed && !currentField.bomb) {
//          if (currentField.minesAround === 0) {
//            revealEmpty(field + v);
//          } else {
//            reveal(field + v);
//          }
//        }
//      });
    };
    
    // INIT FUNCTION
    initialize = function () {
      // Generate clean board
      generateBoard();
      // Add event listeners
      gameField.on('click', 'div', function () {
        $(this).removeClass('hidden');
        fieldNumber = $(this).data('field-number');
        if (!board[fieldNumber].bomb && board[fieldNumber].minesAround === 0) {
          revealEmpty(fieldNumber);
        } else if (board[fieldNumber].bomb) {
          $(this).addClass('failure');
        } else {
          reveal(fieldNumber);
        }
        render();
      });
      gameField.on('contextmenu', 'div', function (e) {
        e.preventDefault();
        
      });
    };
    
    return {
      play: initialize
    };
  }());
  
  MineSweeper.play();
});