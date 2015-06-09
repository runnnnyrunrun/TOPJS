/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  /* MAIN GAME OBJECT */
  var TicTacToe = (function () {
        
    // VARIABLES
    var board,
        currentPlayer,
        currentSymbol,
        endgameFlag,
        fields = $('#fields > div'),
        innerFlag,
        purgedWinning,
        winning = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    
    // METHODS
    var changePlayer,
        drawPlayer,
        initialize,
        isGameOver,
        message,
        newGame,
        render,
        resetBoard,
        setSymbol;
    
    changePlayer = function () {
      currentPlayer = currentPlayer ? 0 : 1;
      setSymbol();
    };
    
    drawPlayer = function () {
      currentPlayer = Math.floor((Math.random() * 2));
      setSymbol();
    };
    
    isGameOver = function (elementIndex) {
      innerFlag = false;
      purgedWinning = winning.filter(function (v) { return v.indexOf(elementIndex) !== -1; });
      
      $.each(purgedWinning, function (i, v) {
        if (v.indexOf(elementIndex) !== -1) {
          if ((fields.eq(v[0]).text() === fields.eq(v[1]).text()) && (fields.eq(v[0]).text() === fields.eq(v[2]).text())) {
            $.each(fields, function (j, val) {
              if (v.indexOf(j) === -1) {
                $(val).addClass('other-field');
              }
            });
            
            innerFlag = true;
          }
        }
      });
      return innerFlag;
    };
    
    message = function (content) {
      $('p.left-para').html(content);
    };
    
    newGame = function () {
      endgameFlag = false;
      message('---');
      resetBoard();
      drawPlayer();
      render();
    };
    
    render = function () {
      $.each(board, function (i, v) {
        fields.eq(i).html(v).removeClass('cross-bg circle-bg other-field');
      });
    };
    
    resetBoard = function () {
      board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    };
    
    setSymbol = function () {
      currentSymbol = currentPlayer ? 'X' : 'O';
    };
    
    // INIT FUNCTION
    initialize = function () {
      newGame();
      
      $('#fields').on('click', 'div', function () {
        if (this.innerHTML === " " && !endgameFlag) {
          this.innerHTML = currentSymbol;
          if (currentSymbol === 'X') {
            $(this).addClass('cross-bg');
          } else {
            $(this).addClass('circle-bg');
          }
          
          if (isGameOver($(this).index())) {
            message('Player ' + currentSymbol + ' wins!');
            endgameFlag = true;
          } else {
            changePlayer();
          }
        }
      });
      
      $('#fields').on('mouseover', function () {
        currentPlayer === 0 ? $(this).addClass('circle-cursor').removeClass('cross-cursor') : $(this).addClass('cross-cursor').removeClass('circle-cursor');
      });
      
      $('p.right-para').on('click', newGame);
    };
    
    return {
      play: initialize
    };
  }());
  
  TicTacToe.play();
});