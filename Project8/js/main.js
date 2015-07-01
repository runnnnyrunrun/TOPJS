/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  var myApp = (function ($) {
    
    // VARIABLES
    var loader = $('<div class="loader"></div>'),
        movieContent,
        requestPending = true;
    
    // METHODS
    var initialize,
        makeTimeout;
    
    makeTimeout = function (i, movie) {
      setTimeout(function() {
        movieContent = $('<div></div>');
        movieContent.append('<h4>' + movie.Title + '</h4>').append('<h5>' + movie.Year + '</h5>').append('<p><strong>Imdb ID:</strong> ' + movie.imdbID + '</p>');
        $('#movies').append(movieContent);
        movieContent.hide().fadeIn();
      }, i * 500);
    }
    
    // INIT method
    initialize = function () {
      $.ajax('http://www.omdbapi.com/?s=wolf&type=movie', {
        beforeSend: function () {
          $('#movies').append(loader);
        },
        complete: function () {
          setTimeout(function() {
            requestPending = false;
          }, 4500);
        },
        success: function (movies) {
          $('#movies div:last-child').remove();
          for (var i = 0; i < movies.Search.length; i++) {
            var movie = movies.Search[i];
            makeTimeout (i, movie);
          }
        }
      });
      
      $(window).on('scroll', function () {
        if (requestPending) { return; }
        if ($(window).scrollTop() === $(document).height() - $(window).height() && $('#movies div.loader').length === 0 && $('#movies div').length < 40) {
          requestPending = true;
          $.ajax('http://www.omdbapi.com/?s=tiger&type=movie', {
            beforeSend: function () {
              $('#movies').append(loader);
            },
            complete: function () {
              setTimeout(function() {
                requestPending = false;
              }, 4500);
            },
            success: function (movies) {
              $('#movies div:last-child').remove();
              for (var i = 0; i < movies.Search.length; i++) {
                var movie = movies.Search[i];
                makeTimeout (i, movie);
              }
            }
          });
        }
      });
    };
    
    return {
      init: initialize
    };
  }(jQuery));
  
  myApp.init();
});