//Variable declarations
const http = require('http');
const express = require('express');
const socket = require('socket.io');

//Start Express Server
const app = express();
const server = http.createServer(app);
const io = socket(server);

//Set static folder
if(process.env.NODE_ENV === 'production'){
app.use(express.static('public'));
}


//var declaration
let size = io.engine.clientsCount;
let roomName;
//Start Socket.io
io.on('connection', socket => {
    socket.on('joinSession', joinSession);
    socket.on('newSession', newSession);
    socket.on('req', (request) =>{
        socket.emit('req', request);
    });
    
   function joinSession(joinCode) { 
       console.log(socket.rooms);
       socket.join(joinCode);
       socket.emit('msg', 'hi');
       console.log(socket.rooms); 
    }

   function newSession(sessionCode){
        roomName=sessionCode;
        socket.join(sessionCode);
        console.log(socket.rooms);
   }

   io.in(roomName).emit("event", "hi");
});

//Listen to port 3000
var port = process.env.PORT || 3000;
server.listen(port, () =>{
    console.log('server running');
})


 