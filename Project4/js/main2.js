/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  /* MAIN GAME OBJECT */
  var SoSimpleSlider = (function () {
    
    // GLOBAL
    var MS_INTERVAL;
    
    // VARIABLES
    var allImages = $('#ssc-images img'),
        allCtrlDots,
        currentImage,
        currentWidth,
        i,
        imgInterval,
        listItem,
        nextImage,
        previewBox = $('<img src="" id="ssc-preview-box" />');
    
    // FUNCTIONS
    var clearPreview,
        goToAny,
        isPreviewHidden,
        next,
        populateCtrl,
        previewNext,
        previewPrevious,
        previous,
        setSelectedCtrlDot;
    
    next = function () {
      if (currentImage === allImages.length - 1) {
        currentWidth = $('#ssc-images').width();
        $('#ssc-images').animate({left: 0}, 500);
      } else {
        currentWidth = allImages.eq(currentImage).width();
        $('#ssc-images').animate({left: '-=' + currentWidth}, 500);
      }
      currentImage = ((currentImage === allImages.length - 1) ? 0 : currentImage + 1);
      previewBox.fadeOut(500);
      setSelectedCtrlDot(currentImage);
    };
    
    previous = function () {
      if (currentImage === 0) {
        currentWidth = $('#ssc-images').width();
        $('#ssc-images').animate({left: '-' + (currentWidth - 640)}, 500);
      } else {
        currentWidth = allImages.eq(currentImage).width();
        $('#ssc-images').animate({left: '+=' + currentWidth}, 500);
      }
      currentImage = ((currentImage === 0) ? allImages.length - 1 : currentImage - 1);
      previewBox.fadeOut(500);
      setSelectedCtrlDot(currentImage);
    };
    
    isPreviewHidden = function () {
      return previewBox.css('display') === 'none';
    };
    
    previewNext = function (e) {
      if (isPreviewHidden) {
        clearInterval(imgInterval);
        nextImage = ((currentImage + 1 === allImages.length) ? 0 : currentImage + 1);
        previewBox[0].src = allImages.eq(nextImage)[0].currentSrc;
        previewBox.css({
          'left': '',
          'right': '-160px'
        }).stop(true).fadeIn(500);
        $('#so-simple-carousel').append(previewBox);
      }
    };
    
    previewPrevious = function (e) {
      if (isPreviewHidden) {
        clearInterval(imgInterval);
        nextImage = ((currentImage === 0) ? allImages.length - 1 : currentImage - 1);
        previewBox[0].src = allImages.eq(nextImage)[0].currentSrc;
        previewBox.css({
          'left': '-160px',
          'right': ''
        }).stop(true).fadeIn(500);
        $('#so-simple-carousel').prepend(previewBox);
      }
    };
    
    clearPreview = function () {
      previewBox.fadeOut(500);
      imgInterval = setInterval(next, MS_INTERVAL);
    };
    
    goToAny = function (e) {
      if (currentImage !== $(e.target).index()) {
        currentImage = $(e.target).index();
        $('#ssc-images').animate({left: '-' + (640 * currentImage)}, 500);
        setSelectedCtrlDot(currentImage);
      }
    };
    
    populateCtrl = function (ci) {
      for (i = 0; i < allImages.length; i++) {
        listItem = '<li class=""></li>';
        $('#ssc-ctrl ul').append(listItem);
      }
      allCtrlDots = $('#ssc-ctrl ul li');
    };
    
    setSelectedCtrlDot = function (dotNumber) {
      allCtrlDots.removeClass('selected');
      allCtrlDots.eq(dotNumber).addClass('selected');
    };
    
    // INIT FUNCTION
    var initialize = function (options) {
      currentImage = options.initialImg - 1 || 0;
      MS_INTERVAL = options.delay || 5000;
      
      populateCtrl(currentImage);
      setSelectedCtrlDot(currentImage);
      $('#ssc-right').on('click', next).on('mouseenter', previewNext).on('mouseleave', clearPreview);
      $('#ssc-left').on('click', previous).on('mouseenter', previewPrevious).on('mouseleave', clearPreview);
      $('#ssc-ctrl ul').on('click', 'li', goToAny);
      imgInterval = setInterval(next, MS_INTERVAL);
    };
    
    return {
      init: initialize
    };
  }());
  
  SoSimpleSlider.init({
    initialImg: 1,
    delay: 5000
  });
});