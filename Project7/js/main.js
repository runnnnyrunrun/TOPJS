/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  var myApp = (function ($) {
    
    // VARIABLES
    var formFields = $('#sign-up-form > fieldset'),
        formSubmitButton = $('#sign-up-form > input[type="button"]');
    
    // METHODS
    var formValidate,
        submitValidate,
        initialize;
    
    formValidate = function (fieldset) {
      var field = fieldset.find('input'),
          fieldId = field.attr('id'),
          fieldValue = field.val(),
          fieldWarning = fieldset.find('div');
      
      switch (fieldId) {
        case 'user-name':
          if (fieldValue) {
            if (RegExp('^[A-Za-z0-9 -\']+$','i').test(fieldValue)) {
              field.removeClass('error').addClass('correct');
              fieldWarning.html('');
            } else {
              field.removeClass('correct').addClass('error');
              fieldWarning.html('Error: entry contains invalid characters');
            }
          } else {
            field.removeClass('correct').addClass('error');
            fieldWarning.html('*This field is required');
          }
          break;
        case 'user-pass':
          if (fieldValue) {
            if (fieldValue.length < 8) {
              field.removeClass('correct').addClass('error');
              fieldWarning.html('Password has to be at least 8 characters');
            } else {
              field.removeClass('error').addClass('correct');
              fieldWarning.html('');
            }
          } else {
            field.removeClass('correct').addClass('error');
            fieldWarning.html('*This field is required');
          }
          break;
        case 'user-pass-conf':
          if ($('#user-pass').hasClass('correct')) {
            if (fieldValue === $('#user-pass').val()) {
              field.removeClass('error').addClass('correct');
              fieldWarning.html('');
            } else {
              field.removeClass('correct').addClass('error');
              fieldWarning.html('Error: please re-enter password');
            }
          } else {
            field.removeClass('correct').addClass('error');
            fieldWarning.html('*This field is required');
          }
          break;
        case 'user-email':
          if (RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]*[a-zA-Z0-9]$','i').test(fieldValue)) {
            field.removeClass('error').addClass('correct');
            fieldWarning.html('');
          } else if (!fieldValue) {
            field.removeClass('correct').addClass('error');
            fieldWarning.html('*This field is required');
          } else {
            field.removeClass('correct').addClass('error');
            fieldWarning.html('Error: please enter correct e-mail address');
          }
          break;
        case 'user-email-conf':
          if ($('#user-email').hasClass('correct')) {
            if (fieldValue === $('#user-email').val()) {
              field.removeClass('error').addClass('correct');
              fieldWarning.html('');
            } else {
              field.removeClass('correct').addClass('error');
              fieldWarning.html('Error: please re-enter your e-mail address');
            }
          } else {
            field.removeClass('correct').addClass('error');
            fieldWarning.html('*This field is required');
          }
          break;
        case 'user-phone':
          if (fieldValue) {
            if (RegExp('^[0-9 +)(-]+[0-9]$','i').test(fieldValue)) {
              field.removeClass('error').addClass('correct');
              fieldWarning.html('');
            } else {
              field.removeClass('correct').addClass('error');
              fieldWarning.html('Error: phone number incorrect');
            }
          } else {
            field.removeClass('correct error');
            fieldWarning.html('');
          }
          break;
        case 'user-zipcode':
          if (fieldValue) {
            if (RegExp('^[A-Za-z0-9 -]+$','i').test(fieldValue)) {
              field.removeClass('error').addClass('correct');
              fieldWarning.html('');
            } else {
              field.removeClass('correct').addClass('error');
              fieldWarning.html('Error: zip code incorrect');
            }
          } else {
            field.removeClass('correct error');
            fieldWarning.html('');
          }
          break;
        default:
          if (fieldValue) {
            field.addClass('correct');
          } else {
            field.removeClass('correct');
          }
      }
    };
    
    submitValidate = function () {
      return ($('#user-name').hasClass('correct') && $('#user-email').hasClass('correct') && $('#user-email-conf').hasClass('correct') && $('#user-pass').hasClass('correct') && $('#user-pass-conf').hasClass('correct') && (!$('#user-phone').val() || $('#user-phone').hasClass('correct')) && (!$('#user-zipcode').val() || $('#user-zipcode').hasClass('correct')));
    };
    
    // INIT method
    initialize = function () {
      formFields.on('keyup', function (e) {
        formValidate($(this));
         if (submitValidate()) {
           formSubmitButton.removeAttr('disabled');
         } else {
           formSubmitButton.attr('disabled', true);
         }
      });
      formSubmitButton.on('mouseover', function (e) {
        
        $(this);
      });
    };
    
    return {
      init: initialize
    };
  }(jQuery));
  
  myApp.init();
});