//Connect socket.io
const socket = io('https://webite-pwa.herokuapp.com/');
// const socket = io('http://localhost:3000')
socket.on('connection');

//category selection
const category = document.querySelector('input[name="categoryRadio"]:checked').value;
//distance selection
const distance = document.querySelector('input[name="distanceRadio"]:checked').value;
//Create new session button
const createSession = document.querySelector('#new-session-submit');
//Join session button
const joinSession = document.querySelector('.join-session');
const joinSessionForm = document.querySelector('.join-session-form');
const joinCodeInput = document.querySelector('#join-session-code');
const sessionCodeOutput = document.querySelector('.session-code');
const sessionCode = makeid(5);
const sessionoutput = document.querySelector('.session-code-h1')
//page section selector
const resultsPage = document.querySelector('.results');
const intro = document.querySelector('.intro');

//information display block
const restaurantName = document.querySelector('.info')
var i = 0;
const yes = document.getElementById('yes');
const no = document.getElementById('no');
const refresh = document.querySelector('.refresh-button');
var yesSelections = []; 
var yesSelections2 = []; 
var request;
var service;
let photos = [];
let photosOut;
let currentPlayer = 'host';
let playerNum = 0;

//winner
const winnerCard = document.querySelector('.cardWinner')

refresh.addEventListener('click', () =>{
    window.location.reload();})

    

//Initialize Google Places API
function initialise() {
    //Autocomplete functionality
    var ac = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));

    joinSearch();
    
    google.maps.event.addListener(ac, 'place_changed', function() {
        startSearch();
    })

    //Join new session
    function joinSearch() {
        joinSessionForm.addEventListener('submit', function(e){
            e.preventDefault();
            joinSessionCode();
            sessionoutput.style.display = 'none';
            socket.on('photos', (data)=>{
                photosOut = data;
            })
            console.log(photosOut);

            socket.on('msg', (msg)=>{
                console.log(msg);
                let array = msg;
                
                //display restaurant information
                restaurantName.innerHTML = 
                `
                <br> <h1>${array[i].name}</h1>
                <p>rating: ${array[i].rating}</p>
                <p>address: ${array[i].vicinity}</p>`;

                yes.addEventListener('click', (a) => {  
                    i++
                    //add place ID to yesSelections array
                    yesSelections2.push(`${array[i].place_id}`);
                   socket.emit('selections2', yesSelections2)
                    //display restaurant information
                    restaurantName.innerHTML = `
                    <br> <h1>${array[i].name}</h1>
                    <p>rating: ${array[i].rating}</p>
                    <p>address: ${array[i].vicinity}</p>`;
                    
                })
                //when no button is clicked
                no.addEventListener('click', (msg) => {
                    i++
                restaurantName.innerHTML = 
                `
                <br> <h1>${array[i].name}</h1>
                <p>rating: ${array[i].rating}</p>
                <p>address: ${array[i].vicinity}</p>`;
                })
            })
        })  
       
    }

    //Search for input address
        function startSearch() {
            createSession.addEventListener('click', function(){
                displaySearch();
                
                newSession();

                //get address info
                var place = ac.getPlace();
                //get lat
                var lat = place.geometry.location.lat();
                // get lng
                var lng = place.geometry.location.lng();

                //Google places search based on location of address
                    service = new google.maps.places.PlacesService(document.createElement('div'));
                    request = {
                        location: new google.maps.LatLng(lat, lng),
                        radius: distance,
                        types: ['restaurant'], 
                        keyword: [`${category}`]
                    };
                    
                    searchResults();
                    
            })
        }
}

//hide start page display results page
function displaySearch() {
    resultsPage.style.display = 'block';
    intro.style.display = 'none';
}

//generate random code
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

function newSession() {
    sessionCodeOutput.innerHTML = `${sessionCode}`;
    socket.emit('newSession', sessionCode);
}

function searchResults() {
                        
    service.search(request, function(results){
        output();
        for(let j= 0; j < results.length; j++){
            photos.push(results[j].photos[0].getUrl({maxWidth: 400, maxHeight: 400, minWidth: 400, minHeight: 300}));
            console.log(photos);
        }
        console.log(results);
        socket.emit('results', results);
        // console.log(restaurantName.innerHTML);
        //when yes button is clicked
        yes.addEventListener('click', () => {  
                i++
                //add place ID to yesSelections array
                yesSelections.push(`${results[i].place_id}`);
                socket.emit('selections', yesSelections)

                //display restaurant information
                output();
        })
        //when no button is clicked
        no.addEventListener('click', () => {
            if(i<=results.length) { 
                i++
            }
                output();
        })

        //output restaurant information
        function output() {
            //display restaurant information
            restaurantName.innerHTML = ` <img src ="${results[i].photos[0].getUrl({maxWidth: 400, maxHeight: 400, minWidth: 400, minHeight: 300})}"
            <br> <h1>${results[i].name}</h1>
            <p>rating: ${results[i].rating}</p>
            <p>address: ${results[i].vicinity}</p>`;
        }
    })
}

function winner() {
    winnerCard.style.display = 'block';

    // if(i => )
}

function joinSessionCode() {
    if(joinCodeInput.value){
        let joinCode = joinCodeInput.value;
        socket.emit('joinSession', joinCode);
        displaySearch();
     }
}



