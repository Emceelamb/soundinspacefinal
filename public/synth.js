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
    var marker = L.marker(client.location, {icon: computerIcon})
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
  console.log(res, "dkf");
  // esynth.triggerAttackRelease(res.note, "8n");
  // playSong(res)

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
    var marker = L.marker(myCoords, {icon: computerIcon}).addTo(layerGroup);
    
    console.log(myCoords)
    tempCoords = [ position.coords.latitude+Math.random(-0.000001, 0.000001), position.coords.longitude+Math.random(-0.0000001, 0.0000001) ]

    mymap.setView(myCoords, 13)
    // socket.emit('my event', tempCoords)
    socket.emit('my event', myCoords)
  })
}


  /// Initiate leaflet map
  let int_lat = 35;
  let int_lng = -97;
  let zoom = 3.5;
  var mymap = L.map('map', {zoomControl: false}).setView([int_lat, int_lng], zoom);
  let layerGroup = L.layerGroup().addTo(mymap);

    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
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
          client.direction="n"
          synth.triggerAttackRelease(client.note.note, client.note.length)      
          // playSong("n");
            socket.emit("recv note", "n");


         
        } else if (direction < -45 && direction > -135){
          console.log("wsy")
          client.direction="w"
          playSong("w")
            socket.emit("recv note", "w");
          // wsynth.triggerAttackRelease(client.note.note,client.note.length);
        
        } else if (direction>45 && direction <135) {
          playSong("e");
          client.direction="e"
         console.log("esn")
            socket.emit("recv note", "e");
          // esynth.triggerAttackRelease(client.note.note,client.note.length);         
      } else {
        console.log("sou")
          client.direction="n"
        playSong("n");
            socket.emit("recv note", "n");
        // synth.triggerAttackRelease(client.note.note, client.note.length)
      }
      // socket.emit("play note", direction)
      socket.emit("recv note", client)
    }
  })
}


const synths=[]


function playSong(dir){
  if (dialup){
  const now = Tone.now() + 0.5
  dialup.tracks.forEach(track => {
      //create a synth for each track
      const synth = new Tone.PolySynth(Tone.Synth, {
          envelope : {
              attack : 0.02,
              decay : 0.1,
              sustain : 0.3,
              release : 1
          }
      })
      switch (dir){
        case "e":
          synth.connect(ePan);
          break;
        case "w":
          synth.connect(wPan);
        default:
          synth.toDestination();
      }
      synths.push(synth)
      //schedule all of the events
      track.notes.forEach(note => {
          synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)
      })
  })
} else {
  //dispose the synth and make a new one
  while(synths.length){
      const synth = synths.shift()
      synth.dispose()
  }
}
}

var computerIcon = L.icon({
    iconUrl: 'work.png',
    iconSize:     [38, 38], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

