/// Initiate leaflet map
let int_lat = 35;
let int_lng = -97;
let zoom = 3.5;
let newList;

var mymap = L.map('map', {zoomControl: false}).setView([int_lat, int_lng], zoom);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOTR5OXptdTBpMmEzaW15czdwZTdiaGwifQ.vkV6jFXaNSDDhKi0AnYbLQ'
}).addTo(mymap)
