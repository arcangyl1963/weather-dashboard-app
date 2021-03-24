// Create a variable to store the city name searched for
var enteredCity = '';
// Create additional variables
var savedCity = [];
var srchCity = $('#citySearch');
var srchBtn = $('#searchBtn');
var clrHistBtn = $('#clearHsty');
var currCity = $('#currCity');
var currTemp = $('#temp');
var currHumid = $('#humidity');
var currWinSpd = $('#windSpd');
var currUVdex = $('#uvIndex');


// validation check to make sure the city name has been stored in local storage already
function checkCty(city) {
    for (var i=0; i<savedCity.length; i++) {
        if(city.toUpperCase()===savedCity[i]) {
            return -1;
        }
    }
    return 1;
}
// Store the API key in a variable
var apiKey = "4a8f1c3d402bd22a309c5913ab421a34";

// Show the current and future weather after city entered
function showWeather(event) {
    event.preventDefault();
    if(srchCity.val().trim()!=='') {
        enteredCity = srchCity.val().trim();
        currentWeather(city);
    }
}