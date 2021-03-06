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
  for (var i = 0; i < savedCity.length; i++) {
    if (city.toUpperCase() === savedCity[i]) {
      return -1;
    }
  }
  return 1;
}
// Store the API key in a variable
var apiKey = '4a8f1c3d402bd22a309c5913ab421a34';

// Show the current and future weather after city entered
function showWeather(event) {
  event.preventDefault();
  if (srchCity.val().trim() !== '') {
    enteredCity = srchCity.val().trim();
    currWeather(enteredCity);
  }
}

function currWeather(city) {
  var apiURL =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    enteredCity +
    '&appid=' +
    apiKey;
  $.ajax({ url: apiURL, method: 'GET' }).then(function (response) {
    console.log(response);

    var weathIcon = response.weather[0].icon;
    var weathIconURL =
      'https://openweathermap.org/img/wn/' + weathIcon + '@2x.png';

    var date = new Date(response.dt * 1000).toLocaleDateString();

    $(currCity).html(
      response.name + ' (' + date + ')' + '<img src=' + weathIconURL + '>'
    );

    var tempFrht = (response.main.temp - 273.15) * 1.8 + 32;
    $(currTemp).html(tempFrht.toFixed(2) + '&#8457');

    $(currHumid).html(response.main.humidity + '%');

    var windSpd = response.wind.speed;
    var windSpdMPH = (windSpd * 2.237).toFixed(1);
    $(currWinSpd).html(windSpdMPH + 'MPH');

    uvIndex(response.coord.lon, response.coord.lat);
    forecast(response.id);
    if (response.cod == 200) {
      savedCity = JSON.parse(localStorage.getItem('currCity'));
      console.log(savedCity);
      if (savedCity == null) {
        savedCity = [];
        savedCity.push(enteredCity.toUpperCase());
        localStorage.setItem('currCity', JSON.stringify(savedCity));
        addToList(enteredCity);
      } else {
        if (find(enteredCity) > 0) {
          savedCity.push(enteredCity.toUpperCase());
          localStorage.setItem('currCity', JSON.stringify(savedCity));
          addToList(enteredCity);
        }
      }
    }
  });
}
function uvIndex(ln, lt) {
  var queryuvURL =
    'https://api.openweathermap.org/data/2.5/uvi?appid=' +
    apiKey +
    '&lat=' +
    lt +
    '&lon=' +
    ln;
  $.ajax({ url: queryuvURL, method: 'GET' }).then(function (response) {
    $(currUVdex).html(response.value);
    if (response.value >= 8) {
      $(currUVdex).removeClass('bg-success bg-warning').addClass('bg-danger');
    } else if (response.value >= 3 && response.value <= 7) {
      $(currUVdex).removeClass('bg-danger bg-success').addClass('bg-warning');
    } else {
      $(currUVdex).removeClass('bg-danger bg-warning').addClass('bg-success');
    }
  });
}

function forecast(cityid) {
  var EoD = false;
  var queryfCastURL =
    'https://api.openweathermap.org/data/2.5/forecast?id=' +
    cityid +
    '&appid=' +
    apiKey;
  $.ajax({ url: queryfCastURL, method: 'GET' }).then(function (response) {
    for (i = 0; i < 5; i++) {
      var fDate = new Date ((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
      var fIconCode = response.list[((i + 1) * 8) - 1].weather[0].icon;
      var fIconURL = 'https://openweathermap.org/img/wn/' + fIconCode + '.png';
      var tempKel = response.list[((i + 1) * 8) - 1].main.temp;
      var tempFar = ((tempKel - 273.5) * 1.8 + 32).toFixed(2);
      var fHumidity = response.list[((i + 1) * 8) - 1].main.humidity;

      $('#fcDate' + i).html(fDate);
      $('#fcImage' + i).html('<img src=' + fIconURL + '>');
      $('#fcTemp' + i).html(tempFar + '&#8457');
      $('#fcHumid' + i).html(fHumidity + '%');
    }
  });
}
function addToList(cty) {
  var myListEL = $('<li>' + cty.toUpperCase() + '</li>');
  $(myListEL).attr('class', 'list-group-item');
  $(myListEL).attr('data-value', cty.toUpperCase());
  $('.list-group').append(myListEL);
}

//Show past search history data when the item in the list is clicked
function showSrchHstyData(event) {
  var myLiEl = event.target;
  if (event.target.matches('li')) {
    enteredCity = myLiEl.textContent.trim();
    currWeather(enteredCity);
  }
}

function showLstCty() {
  $('ul').empty();
  var savedCity = JSON.parse(localStorage.getItem('currCity'));
  if (savedCity !== null) {
    savedCity = JSON.parse(localStorage.getItem('currCity'));
    for (i = 0; i < savedCity.length; i++) {
      addToList(savedCity[i]);
    }
    enteredCity = savedCity[i - 1];
    currWeather(enteredCity);
  }
}

function clearHstry(event) {
  event.preventDefault();
  savedCity = [];
  localStorage.removeItem('currCity');
  document.location.reload();
}

$('#searchBtn').on('click', showWeather);
$(document).on('click', showSrchHstyData);
$(window).on('load', showLstCty);
$('#clearHsty').on('click', clearHstry);
