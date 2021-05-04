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
let total = [];
let intersection = [];
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
    })

    socket.on('selections2', (msg) =>{
        selection2 = msg;
        selectionWinner();
    })
    
    function selectionWinner() {
        if(selection1){
            if(selection1.length >= 0){
            total.push(selection1);
        }}
        if(selection2){
            if(selection2.length >= 0){
                total.push(selection2);
            }
        }

        if(total.length >= 2){
            intersection = selection2.filter(x => selection1.includes(x));
            if(intersection.length===1){
            console.log(intersection);
            io.emit('winner', intersection);
            }
        }
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


 