//Variable declarations
const http = require('http');
const express = require('express');
const socket = require('socket.io');

//Start Express Server
const app = express();
const server = http.createServer(app);
const io = socket(server);

//Set static folder
app.use(express.static('public'));


//var declaration
let size = io.engine.clientsCount;
let roomName;
let resultsOut;
let photosOut;
let selection1;
let selection2;
let winner;
let intersection;
//Start Socket.io
io.on('connection', socket => {
    socket.on('joinSession', joinSession);
    socket.on('newSession', newSession);
    
    socket.on('results', (data) =>{
        resultsOut = data;
    });

    socket.on('photos', (data) =>{
        photosOut = data;
    });
    
    socket.on('selections', (msg) =>{
        selection1 = msg;
        console.log(selection1);
    })

    socket.on('selections2', (msg) =>{
        selection2 = msg;
        console.log(selection2);
    })
    
    function selectionWinner(a, b) {
        intersection = a.filter(element => b.includes(element));
        socket.emit('winner', winner);
    }

   function joinSession(joinCode) { 
       socket.join(joinCode);
       socket.emit('photosout', photosOut);
       socket.emit('msg', resultsOut);
    }

   function newSession(sessionCode){
        roomName=sessionCode;
        socket.join(sessionCode);
   }
});

//Listen to port 3000
var port = process.env.PORT || 3000;
server.listen(port, () =>{
    console.log('server running');
})


 