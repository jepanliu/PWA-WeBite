//category selection
const category = document.querySelector('input[name="categoryRadio"]:checked').value;
//distance selection
const distance = document.querySelector('input[name="distanceRadio"]:checked').value;
//Create new session button
const createSession = document.querySelector('#new-session-submit');
//page section selector
const results = document.querySelector('.results');
const intro = document.querySelector('.intro');

//information display block
const restaurantName = document.querySelector('.info')
var i = 1;
const yes = document.getElementById('yes');
const no = document.getElementById('no');
const refresh = document.querySelector('.refresh-button');
var yesSelections = []; 

refresh.addEventListener('click', () =>{
    window.location.reload();})

//Initialize Google Places API
function initialise() {
    //Autocomplete functionality
    var ac = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
    google.maps.event.addListener(ac, 'place_changed', function() {
    //Search for input address
    createSession.addEventListener('click', function(){
       
        results.style.display = 'block';
        intro.style.display = 'none';

        //get address info
        var place = ac.getPlace();
        //get lat
        var lat = place.geometry.location.lat();
        // get lng
        var lng = place.geometry.location.lng();

        //Google places search based on location of address
        var service = new google.maps.places.PlacesService(document.createElement('div'));
        var request = {
            location: new google.maps.LatLng(lat, lng),
            radius: distance,
            types: ['restaurant'], 
            keyword: [`${category}`]
        };
        service.search(request, function(results){
            console.log(results);
            output();

            //when yes button is clicked
            yes.addEventListener('click', () => {
                    i++
    
                    //add place ID to yesSelections array
                    yesSelections.push(`${results[i].place_id}`);
                    console.log(yesSelections);

                    //display restaurant information
                    output();
            })

            //when no button is clicked
            no.addEventListener('click', () => {
                i++
                output();
            })

        function output() {
                console.log(i);
                console.log(results.length);
                //display restaurant information
                restaurantName.innerHTML = ` <img src ="${results[i].photos[0].getUrl({maxWidth: 400, maxHeight: 400, minWidth: 400, minHeight: 300})}"
                <br> <h1>${results[i].name}</h1>
                <p>rating: ${results[i].rating}</p>
                <p>address: ${results[i].vicinity}</p>`;

                console.log(results[i].name, results[i].rating, results[i].price_level);
        }

        // function refreshButton() {
        //     if(i >= results.length){
        //         console.log('a')
        //         refresh.style.display = 'block';
               
        //         })                
        //     }
        // }

        })
    })
})
}








