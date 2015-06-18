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
        fieldNumber,
        gameField = $('#fields'),
        randomCounter,
        tempBombs,
        tempField;
    
    // METHODS
    var countAdjacent,
        generateBoard,
        generateBombs,
        initialize,
        isBomb,
        render,
        resetBoard,
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
      $.each(board, function(i, v) {
        tempField = $('<div>').data('field-number', i);
        if (v.bomb) {
          tempField.text('B');
        } else if (v.minesAround > 0) {
          tempField.text(v.minesAround);
        }
        gameField.append(tempField);
      });
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
    
    // to nizej jako funkcja rekurencyjna, ktora odslania pola jesli nie zostaly odsloniete i jesli nie granicza z zadna bomba, a potem sprawdza odsloniete pola itd.
    revealEmpty = function (field) {
      $.each([-10, -9, -8, -1, 1, 8, 9, 10], function(i, v) {

      });
    };
    
    // INIT FUNCTION
    initialize = function () {
      // Generate clean board
      
      generateBoard();
//      gameField.on('click', 'div', function () {
//        fieldNumber = $(this).data('field-number');
//        if (!board[fieldNumber].bomb && board[fieldNumber].minesAround === 0) {
//          $(this).addClass('revealed');
//          revealEmpty(fieldNumber);
//        } else if (board[fieldNumber].bomb) {
//          $(this).addClass('failure');
//        }
//      });
//      gameField.on('contextmenu', 'div', function (e) {
//        e.preventDefault();
//        
//      });
    };
    
    return {
      play: initialize
    };
  }());
  
  MineSweeper.play();
});