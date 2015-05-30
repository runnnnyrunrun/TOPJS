/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  /* MAIN GAME OBJECT */
  var SoSimpleSlider = (function () {
    
    // GLOBAL
    var MS_INTERVAL;
    
    // VARIABLES
    var allImages = $('#sss-images img'),
        allCtrlDots,
        currentImage,
        i,
        imgInterval,
        listItem,
        nextImage,
        previewBox = $('<img src="" id="sss-preview-box" />');
    
    // FUNCTIONS
    var clearPreview,
        goToAny,
        next,
        populateCtrl,
        previewNext,
        previewPrevious,
        previous,
        setSelectedCtrlDot,
        showImage;
    
    next = function () {
      currentImage = ((currentImage + 1 === allImages.length) ? 0 : currentImage + 1);
      showImage(currentImage);
      setSelectedCtrlDot(currentImage);
    };
    
    previous = function () {
      currentImage = ((currentImage === 0) ? allImages.length - 1 : currentImage - 1);
      showImage(currentImage);
      setSelectedCtrlDot(currentImage);
    };
    
    previewNext = function (e) {
      clearInterval(imgInterval);
      nextImage = ((currentImage + 1 === allImages.length) ? 0 : currentImage + 1);
      var previewSrc = allImages.eq(nextImage)[0].currentSrc;
      previewBox[0].src = previewSrc;
      previewBox.css({
        'left': '',
        'right': '-160px'
      }).fadeIn(500);
      $('#sss-frame').append(previewBox);
    };
    
    previewPrevious = function (e) {
      clearInterval(imgInterval);
      nextImage = ((currentImage === 0) ? allImages.length - 1 : currentImage - 1);
      var previewSrc = allImages.eq(nextImage)[0].currentSrc;
      previewBox[0].src = previewSrc;
      previewBox.css({
        'left': '-160px',
        'right': ''
      }).fadeIn(500);
      $('#sss-frame').prepend(previewBox);
    };
    
    clearPreview = function () {
      previewBox.fadeOut(500);
      imgInterval = setInterval(next, MS_INTERVAL);
    };
    
    goToAny = function (e) {
      currentImage = $(e.target).index();
      showImage(currentImage);
      setSelectedCtrlDot(currentImage);
    };
    
    populateCtrl = function (ci) {
      for (i = 0; i < allImages.length; i++) {
        listItem = '<li class=""></li>';
        $('#sss-ctrl ul').append(listItem);
      }
      allCtrlDots = $('#sss-ctrl ul li');
    };
    
    showImage = function (ci) {
      allImages.fadeOut(500);
      previewBox.fadeOut(500);
      allImages.eq(ci).fadeIn(1000);
    };
    
    setSelectedCtrlDot = function (dotNumber) {
      allCtrlDots.removeClass('selected');
      allCtrlDots.eq(dotNumber).addClass('selected');
    };
    
    // INIT FUNCTION
    var initialize = function (initialImage, sec) {
      currentImage = initialImage;
      MS_INTERVAL = sec;
      
      populateCtrl(currentImage);
      setSelectedCtrlDot(currentImage);
      showImage(currentImage);
      $('#sss-right').on('click', next).on('mouseover', previewNext).on('mouseleave', clearPreview);
      $('#sss-left').on('click', previous).on('mouseover', previewPrevious).on('mouseleave', clearPreview);
      $('#sss-ctrl ul').on('click', 'li', goToAny);
      imgInterval = setInterval(next, MS_INTERVAL);
    };
    
    return {
      init: initialize
    };
  }());
  
  SoSimpleSlider.init(0, 5000);
});