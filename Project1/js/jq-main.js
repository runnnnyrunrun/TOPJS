/*jslint browser: true*/
/*global $, jQuery, console*/
$(document).ready(function () {
  "use strict";
  ////////////////////////
  // Warmup functions


  var my_max = function (ary) {
    var maks = ary[0];
    $.each(ary, function (i, j) {
      if (j > maks) { maks = j; }
    });
    return maks;
  };

  var vowel_count = function (txt) {
    var my_string = txt.split("");
    var counter = 0;
    $.each(my_string, function (i, j) {
      if (j.search(/[aeiouy]/i) !== -1) { counter += 1; }
    });
    return counter;
  };

  var reverse = function (txt) {
    var newTxt = txt.split("").reverse().join("");
    return newTxt;
  };
  ////////////////////////

  //
  // CALCULATOR
  //

  ////////////////////////
  // Operations
  
  var operations = {
    add: function (a, b) {
      return a + b;
    },
    subtract: function (a, b) {
      return a - b;
    },
    multiply: function (a, b) {
      return a * b;
    },
    divide: function (a, b) {
      return a / b;
    }
  };

  ////////////////////////
  // Variable declarations

  // all numerical buttons
  var numericButtons = $(".number");

  // first value
  var firstval = 0.0;

  // selected operation
  var chosenOperation = null;

  // currently displayed value
  var cache = 0;

  // element used as display
  var calcDisp = $('#calc-display');

  // type of button
  var lastPressed = null;

  // Debugger
  var logmetender = function () {
    var ob = {
      firstval: firstval,
      chosenop: chosenOperation,
      cache: cache
    };
    console.log(ob);
  };

  // Styling divs informing about chosen operation
  var clearInfoClasses = function () {
    $('li').removeClass("selecta");
  };
  var operationInfo = function (x) {
    clearInfoClasses();
    $("." + x).addClass("selecta");
  };

  // Reset
  var resetAll = function () {
    firstval = null;
    chosenOperation = null;
    cache = 0;
    calcDisp.text("0");
    clearInfoClasses();
    lastPressed = null;
  };
  
  ////////////////////////
  // Mechanics - event listeners

  // Numeric buttons
  numericButtons.on("click", function (e) {
    if (lastPressed === "count") { resetAll(); }

    var value = e.target.innerHTML;

    if (firstval === 0 && chosenOperation === "subtract" && calcDisp.text().search(/\-/) === -1) {
      value = value * -1;
    }

    if (cache === 0 || cache === null) {
      calcDisp.text(value);
    } else {
      calcDisp.append(value);
    }
    cache = parseFloat(calcDisp.text());
    lastPressed = "num";
  });

  // Add comma
  $("#comma").on("click", function (e) {
    var value = e.target.innerHTML;

    if (cache === 0 && chosenOperation === "subtract") {
      calcDisp.text("-0.");
    } else if (cache === 0) {
      calcDisp.text("0.");
    } else if (calcDisp.text().search(/\./) === -1) {
      calcDisp.append(".");
    }
    cache = calcDisp.text();
    lastPressed = "com";
  });

  // Operations
  $.each(["add", "subtract", "multiply", "divide"], function (i, v) {
    $("#" + v).on("click", function (e) {
      chosenOperation = v;
      firstval = firstval || cache;
      cache = null;
      operationInfo(v);
      lastPressed = "ope";
    });
  });
  
  // Count
  var doOperation = function () {
    if (chosenOperation) {
      cache = cache || parseFloat(firstval);
      
      firstval = operations[chosenOperation](parseFloat(firstval), parseFloat(cache));
      firstval = Math.round(firstval * 100000) / 100000;
      calcDisp.text(firstval);
    }
    lastPressed = "count";
  };
  $("#count").on("click", doOperation);

  // Reset calculator
  $("#clr").on("click", resetAll);
});