const express = require('express'),
      app     = express()
      server  = require('http').createServer(app),
      io      = require('socket.io')(server),
      path    = require('path');

const PORT = process.env.PORT || 8000;

let clientList = [];

const noteList = ['E3', 'F3', 'G3', 'C6']

app.use(express.static('public'));

io.on('connection', (socket)=>{

  console.log('Connection was made!');

  // Get IP Address of socket conn
  let address = socket.handshake.address;
  address=address.split(':')[3];

  socket.on('my event', (data)=>{
    console.log(data)
  let client = {
    "address"  : address,
    "socketId" : socket.id,
    "location" : data
  }

  let note = {
    //"note"   : noteList[clientList.indexOf(address)],
    "note"   : noteList[clientList.length],
    "length" : "8n"
  }

  client["note"] = note;

  // Add Client to list
  clientList.push(client);
  // console.log(clientList, "listClie");

  io.emit('server response', clientList);
  //io.emit('server response', `${clientList}`);
  console.log(`We have a client: ${socket.id}`);
  console.log(clientList, "clie")

  io.clients((err, clients) => {
    if (err) throw err;
    console.log(clients, "butter")
  })

  // Send IP addr to client
  io.to(`${socket.id}`).emit('send ip', address)


  // Send note to client
  // io.to(`${socket.id}`).emit('play note', note)
  })

  socket.on('recv note',(data)=>{
    io.to(data.socketId).emit("play note", data.direction)
    console.log("this is play ", data)

  })


  // Init Client obj

  socket.on('disconnect', () =>{

    // clientList = [...new Set(clientList)];
    // let index = clientList.socketId.indexOf(socket.id);
    const index = clientList.map(e => e.socketId).indexOf(socket.id)
    console.log(index,"thisis")

    if(index > -1){
      clientList.splice(index, 1);
      console.log(clientList)
      console.log("above is clist")
      io.json.send('server response', `${clientList}`);
      
    }
    // console.log(`${socket.id} disconnected.`, clientList.length)

    // console.log( clientList )
    // io.json.send('server response', `${clientList}`);
  });
});

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname +'/index.html'));
});

app.get('/synth', (req, res)=>{
  res.sendFile(path.join(__dirname +'/public/synth.html'));
});

server.listen(PORT, ()=>{
  console.log(`Server is up! Listening on port ${PORT}.`)
});

var globalTimer = 0;
function setLoop(timer){
  
  //console.log(globalTimer, timer % clientList.length );
  let index = timer % clientList.length 

  //console.log(clientList[index].socketId, clientList[index].note)
  if(clientList.length>0){
    io.to(clientList[index].socketId).emit('play note',  clientList[index].note)
  }
  globalTimer++;
}

// setInterval(function(){{setLoop(globalTimer)}}, 1000)

