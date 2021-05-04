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
let winner;
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
        selectionWinner();
        console.log(selection1);
    })

    socket.on('selections2', (msg) =>{
        selection2 = msg;
        selectionWinner();
        console.log(selection2);
    })
    
    function selectionWinner() {
        for(let i = 0; i < selection2 || i < selection1; i++){
            if(selection2 && selection1){
                if(selection1[i] === selection2[i]){
                    console.log(selection2)
                }
           }
           else{
               console.log('oop');
           }
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


 