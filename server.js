//Variable declarations
const http = require('http');
const express = require('express');
const socket = require('socket.io');

//Start Express Server
const app = express();
const server = http.createServer(app);
const io = socket(server);

//Set static folder
//if(process.env.NODE_ENV === 'production'){
app.use(express.static('public'));
//}


//var declaration
let size = io.engine.clientsCount;
let roomName;
let resultsOut;
let photosOut;
let selection1;
let selection2;
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
        selectionWinner();
    })

    socket.on('selections2', (msg) =>{
        selection2 = msg;
        console.log(selection2);
        selectionWinner();
    })
    
    function selectionWinner() {
        if(selection1 === selection2){
            console.log(`lets go to ${selection1}`);
        }
    }

   function joinSession(joinCode) { 
       console.log(socket.rooms);
       socket.join(joinCode);
       socket.emit('msg', resultsOut);
       socket.emit('photos', photosOut);
       console.log(socket.rooms); 
    }

   function newSession(sessionCode){
        roomName=sessionCode;
        socket.join(sessionCode);
        console.log(socket.rooms);
   }

//    io.in(roomName).emit("event", "hi");
});

//Listen to port 3000
var port = process.env.PORT || 3000;
server.listen(port, () =>{
    console.log('server running');
})


 