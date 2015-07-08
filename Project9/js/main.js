/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
  'use strict';
  
  var myApp = (function ($) {
    
    // VARIABLES
    var distanceMeter = $('#distance > span'),
        map = document.getElementById('googleMap'),
        mapObj,
        mapProp,
        markers = [],
        oldLat,
        oldLong,
        path = [],
        pathLine,
        totalDistance = 0,
        zoom = 15;
    
    // CONSTRUCTORS
    
    var setMarker = function (coords) {
      var tempMarker = new google.maps.Marker({
        position: coords,
        map: mapObj,
        title: coords.toString()
      });
      markers.push(tempMarker);
    };
    
    // METHODS
    var countDistance,
        deg2rad,
        drawPath,
        getDistanceFromLatLonInKm,
        initialize;
    
    countDistance = function (path) {
      if (path.length < 2) {
        distanceMeter.html('0');
        return true;
      }
      totalDistance = 0;
      oldLat = path[0].A;
      oldLong = path[0].F;
      $.each(path, function (i, v) {
        if (i === 0) return true;
        totalDistance += getDistanceFromLatLonInKm(oldLat, oldLong, v.A, v.F);
        oldLat = v.A;
        oldLong = v.F;
        distanceMeter.html(Math.round(totalDistance * 1000)/1000);
      });
    };
    
    deg2rad = function (deg) {
      return deg * (Math.PI/180)
    };
    
    drawPath = function (path) {
      if (pathLine) {
        pathLine.setMap(null);
      }
      pathLine = new google.maps.Polyline({
        path: path,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
      });
      
      pathLine.setMap(mapObj);
    }
    
    getDistanceFromLatLonInKm = function (lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);
      var dLon = deg2rad(lon2-lon1);
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }
    
    // INIT method
    initialize = function () {
      mapProp = {
        center: new google.maps.LatLng(53.0153403, 18.5970523),
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      mapObj = new google.maps.Map(map, mapProp);
      
      google.maps.event.addListener(mapObj, 'click', function (e) {
        var pathIndex = path.indexOf(e.latLng);
        
        if (pathIndex === -1) {
          setMarker(e.latLng);
          path.push(e.latLng);
        }
        
        markers.forEach(function (n) {
          google.maps.event.clearListeners(n, 'click');
          google.maps.event.addListener(n, 'click', function (e) {
            pathIndex = path.indexOf(e.latLng);
            
            if (pathIndex !== -1) {
              path.splice(pathIndex, 1);
              markers[pathIndex].setMap(null);
              markers.splice(pathIndex, 1);
            }
            
            drawPath(path);
            countDistance(path);
          });
        });
        
        drawPath(path);
        countDistance(path);
      });
      
      $('#clearMarkers').on('click', function () {
        path = [];
        $.each(markers, function (i, v) {
          v.setMap(null);
        });
        markers = [];
        drawPath(path);
        countDistance(path);
      });
      
      $('#savePath').on('click', function () {
        if (path.length > 0) {
          
        }
      });
      
      drawPath(path);
      countDistance(path);
    }
    
    return {
      init: initialize
    };
    
  }(jQuery));
  
  myApp.init();
});