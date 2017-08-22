var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var noteUpdate = [
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]


app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/session/:name', function(req, res){
  res.send('nutttty '+req.params.name);
});

io.on('connection', function(socket){
  console.log('A user connected');
  
  socket.emit('connection', {noteUpdate: noteUpdate,});


  //socket.emit('step')
//
  //Send a message after a timeout of 4seconds
  setTimeout(function(){
    socket.send('Sent a message 4seconds after connection!');
  }, 4000);
  

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
  
  socket.on('step', function(data){
  //console.log(data);
  noteUpdate[data.row][data.beat] = noteUpdate[data.row][data.beat] * -1; 
  io.emit('step', data);
  });

  socket.on('tempo', function(data){
    //console.log(data);
    io.emit('tempo', data);
  });

  socket.on('scale', function(data){
    console.log(data.newScale);
    io.emit('scale', data);
  });

  socket.on('key', function(data){
    console.log(data);
    io.emit('key', data);
  });

});

// dvd ip: 172.17.186.184:3000
http.listen(3323, '0.0.0.0', function(){
  console.log('listening on *:3323');
});