////////////////////////
// Warmup functions

var my_max = function (ary) {
  var maks = ary[0];
  ary.forEach(function (i) {
    if (i > maks) {
      maks = i;
    }
  });
  return maks;
};

var vowel_count = function (txt) {
  var my_string = txt.split("");
  var counter = 0;
  
  my_string.forEach(function (j) {
    if (j.search(/[aeiouy]/i) !== -1) {
      counter += 1;
    }
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

var add = function (a, b) {
  return a + b;
};

var subtract = function (a, b) {
  return a - b;
};

var multiply = function (a, b) {
  return a * b;
};

var divide = function (a, b) {
  return a / b;
};

////////////////////////
// Variable declarations

// all numerical buttons
var numericButtons = document.getElementsByClassName("number");

// first value
var firstval = 0.0;

// selected operation
var chosenOperation = null;

// currently displayed value
var cache = 0;

// element used as display
var displayWindow = document.getElementById('calc-display');

// type of button
var lastPressed = null;

// Debugger
var logmetender = function() {
  var ob = {
    firstval: firstval,
    chosenop: chosenOperation,
    cache: cache
  };
  console.log(ob);
};

// Styling divs informing about chosen operation
var clearInfoClasses = function() {
  var info = document.getElementsByTagName('li');
  for (var i = 0; i < info.length; i++) {
    if ( info[i].className.match(/(?:^|\s)selecta(?!\S)/) ) {
      info[i].className = info[i].className.replace( /(?:^|\s)selecta(?!\S)/g , '' );
    }
  };
};
var operationInfo = function(x) {
  clearInfoClasses();
  var el = document.getElementsByClassName(x);
  el[0].className += " selecta";
};

////////////////////////
// Mechanics - event listeners

// Numeric buttons
for (var i = 0; i < numericButtons.length; i++) {
  numericButtons[i].addEventListener("click", function (e) {
    if (lastPressed === "count") {
      resetAll();
    }
    var value = e.target.innerHTML;
    
    if (firstval === 0 && chosenOperation === "subtract" && displayWindow.innerHTML.search(/\-/) === -1) {
      value = value * -1;
    }
    
    if (cache === 0 || cache === null) {
      displayWindow.innerHTML = value;
    } else {
      displayWindow.innerHTML += value;
    }
    
    cache = parseFloat(displayWindow.innerHTML);
    lastPressed = "num";
  });
};

// Add comma
document.getElementById("comma").addEventListener("click", function (e) {
  var value = e.target.innerHTML;
  
  if (cache === 0 && chosenOperation === "subtract") {
    displayWindow.innerHTML = "-0.";
    cache = toString(displayWindow.textContent);
  } else if (cache === 0) {
    displayWindow.innerHTML = "0.";
    cache = displayWindow.textContent;
  } else if (displayWindow.innerHTML.search(/\./) === -1) {
    displayWindow.innerHTML += ".";
    cache = parseFloat(displayWindow.textContent);
  }
  lastPressed = "com";
});

// Operations
["add", "subtract", "multiply", "divide"].forEach(function (elem) {
  document.getElementById(elem).addEventListener("click", function (e) {
    chosenOperation = e.target.id;
    firstval = firstval || cache;
    cache = null;
    operationInfo(elem);
    lastPressed = "ope";
  });
});

// Count
var doOperation = function() {
  if (chosenOperation) {
    if (!cache) {
      cache = parseFloat(firstval);
    }
    firstval = window[chosenOperation](parseFloat(firstval), parseFloat(cache));
    firstval = Math.round(firstval * 100000) / 100000;
    displayWindow.innerHTML = firstval;
  }
  lastPressed = "count";
};
document.getElementById("count").addEventListener("click", doOperation);

// Reset calculator
var resetAll = function() {
  firstval = null;
  chosenOperation = null;
  cache = 0;
  displayWindow.innerHTML = 0;
  clearInfoClasses();
  lastPressed = null;
};
document.getElementById("clr").addEventListener("click", resetAll);