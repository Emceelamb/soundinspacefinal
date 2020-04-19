let PANVAR = 0; // sets pan range
// let synths = [];
let clientList = [];
let myCoords;
let synth = new Tone.Synth().toDestination();

let nePan = new Tone.Panner(0.5).toDestination();
let nesynth = new Tone.Synth().connect(nePan);

let ePan = new Tone.Panner(1).toDestination();
let esynth = new Tone.Synth().connect(ePan);

let nwPan = new Tone.Panner(-0.5).toDestination();
let nwsynth = new Tone.Synth().connect(nwPan);

let wPan = new Tone.Panner(-1).toDestination();
let wsynth = new Tone.Synth().connect(wPan);

let socket = io()
  socket.on('connect', function() {
  // socket.emit('my event', "Connected mah boi!!!!!")
  // function sendNote(client){
  //   socket.broadcast.to(client).emit("play note", peer.note)
  // } 

  getLocation();
});

socket.on('server response', function(res){
  clientList = res;
  // console.log(clientList, clientList.length);
  // console.log(res)

    layerGroup.clearLayers();
  $('#clients').empty();
  clientList.forEach((client)=>{
    // let tempC = [client.location[0], client.location[1]+Math.random(0.0001)]
    var marker = L.marker(client.location)
                .bindPopup(client.location.toString())
                .on('mouseover', function (){this.openPopup()})
                .on('mouseout', function(){this.closePopup()})
                .on('click', onClick);
            
    marker.addTo(layerGroup);
    // var marker = L.marker(tempC).on('click', onClick).addTo(layerGroup);

    $('#clients').append(
      `
      <button type="button" class="clientButton" onclick="sendNote('${client.socketId}')">${client.address}</button>
      `
    )  
  })
    // for (let i = 0; i < clientList.length; i++){

  //   console.log(clientList[i], i)
  //   $('#clients').append(
  //     `
  //     <button type="button" class="clientButton" onclick="sendNote(${clientList[i]})">${clientList[i].address}</button>
  //     `
  //   )

  // $('#peers').empty();
  // let ips = res.split(",")
  // ips.forEach((ip)=>{
  //   ipAdd= ip.split(":");
  //   $('#peers').append(
  //     j:w
  //     `
  //     <li class="peerIp">${ipAdd[3]}</li>
  //     `
  //   )
  // })
});

socket.on('send ip', (res)=>{
  $('#ipAddr').html(res);
  let synth = new Tone.Synth().toDestination();
  // synth.triggerAttackRelease(res.note, res.length);
});

let num = 0;
socket.on('play note', (res)=>{
  // console.log(res);
  esynth.triggerAttackRelease(res.note, "8n");
  console.log(res)

})

function sendNote(client){
  console.log(clientList[0])
  console.log(socket, "@")
  console.log(client)
  // io.sockets.socket("play note", clientList[0].note);
  // socket.broadcast.to(client).emit('play note', clientList[0])
  // socket.broadcast.to(client).emit("play note", peer.note)
} 

function getLocation(){
  if(!navigator.geolocation){
    console.error("No geolocation available.")
  }
  navigator.geolocation.getCurrentPosition(position=>{
    myCoords = [ position.coords.latitude, position.coords.longitude ]
    var marker = L.marker(myCoords).addTo(layerGroup);
    
    console.log(myCoords)
    tempCoords = [ position.coords.latitude+Math.random(-0.000001, 0.000001), position.coords.longitude+Math.random(-0.0000001, 0.0000001) ]

    mymap.setView(tempCoords, 13)
    // socket.emit('my event', myCoords)
    socket.emit('my event', tempCoords)
  })
}


  /// Initiate leaflet map
  let int_lat = 35;
  let int_lng = -97;
  let zoom = 3.5;
  var mymap = L.map('map', {zoomControl: false}).setView([int_lat, int_lng], zoom);
  let layerGroup = L.layerGroup().addTo(mymap);

    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOTR5OXptdTBpMmEzaW15czdwZTdiaGwifQ.vkV6jFXaNSDDhKi0AnYbLQ'
  }).addTo(mymap)

function onClick(e) {
    let targetCoord = this.getLatLng();
  console.log(myCoords, targetCoord)
    let direction = turf.bearing([myCoords[1], myCoords[0]],[targetCoord.lng, targetCoord.lat],  );
  console.log(direction);
  clientList.forEach((client)=>{
    let c = [targetCoord.lat, targetCoord.lng]
    let d = [client.location[0], client.location[1]]
    if (c.toString() == d.toString()){
      // console.log(client.note.length);
      
      
        if( direction > -45 && direction < 45){
          console.log("nsyn")
          synth.triggerAttackRelease(client.note.note, client.note.length)      

         
        } else if (direction < -45 && direction > -135){
          console.log("wsy")
          wsynth.triggerAttackRelease(client.note.note,client.note.length);
        
        } else if (direction>45 && direction <135) {
         console.log("esn")
          esynth.triggerAttackRelease(client.note.note,client.note.length);         
      } else {
        console.log("sou")
        synth.triggerAttackRelease(client.note.note, client.note.length)
      }
      socket.emit("recv note", client.note)
    }
  })
}
