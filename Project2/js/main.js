/*jslint browser: true*/
/*global $, jQuery, console*/
(function () {
  "use strict";
  
  var contents = [
    {
      hea: "&hearts; Love, Peace & Obesity",
      par: "We are the largest fastfood chain in eastern west of country. Our meals are full of healthy and nutritious lard, corn syrup and beef imitation."
    },
    {
      hea: "&raquo; Extra large, extra fun",
      par: "<table><tr><td>Burger XL</td><td>630kcal</td><td>12.99$</td></tr><tr><td>Burger XXL</td><td>980kcal</td><td>15.99$</td></tr><tr><td>Mammoth</td><td>1630kcal</td><td>22.99$</td></tr><tr><td>Cheese Monster</td><td>1130kcal</td><td>16.99$</td></tr><tr><td>Diet Coke</td><td>1kcal</td><td>1.99$</td></tr><tr><td>The Patriot Burger</td><td>704kcal</td><td>9.99$</td></tr></table>"
    },
    {
      hea: "&empty; Disclaimer",
      par: "WARNING: Handle with care. May contain small children."
    }
  ];
    
  $("h1").html(contents[0].hea);
  $("p").html(contents[0].par);
  
  $("li").on("click", function (e) {
    e.preventDefault();
    var listitems = $("li");
    var position = listitems.index(this);
    
    listitems.removeClass("selected");
    $(this).addClass("selected");
    
    $("h1").html(contents[position].hea);
    $("p").html(contents[position].par);
  });
}());