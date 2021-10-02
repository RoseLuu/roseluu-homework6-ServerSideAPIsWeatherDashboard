var APIKey = '387641054725543e8ae9cd67a7569bc5';
var cityName = document.getElementById('cityName');
var searchBtn = document.querySelector('#searchBtn');
var weatherIcon = document.querySelector('.weathericon');
var temperatureEl = document.querySelector('#temperature');
var humidityEl = document.querySelector('#humidity');
var windEl = document.querySelector('#wind-speed');
var uvEl = document.querySelector('#uvColor');
var nameBig = document.querySelector('#name');
var searchHistory = [];
var city = '';


function showWeather() {
    var city = cityName.value.trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (respond) {
            return respond.json()
        })
        .then(function (data) {
            console.log(data);
            //change weather from Kelvin to Fahrenheit
            var celsius = data.main.temp - 273;
            temperatureEl.textContent = Math.floor(celsius * (9 / 5) + 32);
            windEl.textContent = Math.floor((data.wind.speed) * 2.237);
            var dt = data.dt;
            //convert the dt to get date and hour
            var date = new Date(dt * 1000);
            //Get date and name of the city
            nameBig.textContent = data.name + ' ' + '(' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear() + ')' + '.';
            humidityEl.innerHTML = data.main.humidity;
            var weatherIconId = data.weather[0].icon;
            weatherIcon.innerHTML = `<img src='./icons/${weatherIconId}.png' />`;
            saveCity();
            function getUVIndex() {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var uvindexUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;
                fetch(uvindexUrl)
                    .then(function (res) {
                        return res.json()
                    })
                    .then(function (indexdata) {
                        uvEl.textContent = indexdata.current.uvi;
                        if (indexdata.current.uvi <= 3 && indexdata.current.uvi >= 0) {
                            uvEl.setAttribute('class', 'uvlow');
                        } else if (indexdata.current.uvi > 3 && indexdata.current.uvi <= 6) {
                            uvEl.setAttribute('class', 'uvmoderate');
                        } else if (indexdata.current.uvi > 6 && indexdata.current.uvi <= 8) {
                            uvEl.setAttribute('class', 'uvhigh');
                        } else if (indexdata.current.uvi > 8 && indexdata.current.uvi <= 11) {
                            uvEl.setAttribute('class', 'uvveryhigh');
                        } else if (indexdata.current.uvi > 11) {
                            uvEl.setAttribute('class', 'uvextreme');
                        }
                    })
            }
            getUVIndex();
            forecastFiveDay();
            if (data.cod == 200) {
                searchHistory = JSON.parse(localStorage.getItem("search"));
                console.log(searchHistory);
                if (searchHistory == null) {
                    searchHistory = [];
                    searchHistory.push(city)
                    localStorage.setItem('search', JSON.stringify(searchHistory));
                } else {
                    searchHistory.push(city)
                    localStorage.setItem('search', JSON.stringify(searchHistory));
                }
            }

        });
}

//five day forecast weather
function forecastFiveDay() {
    var city = cityName.value.trim();
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIKey;
    // var forecastEl = document.querySelector('.forecastWeather');

    fetch(forecastUrl)
        .then(function (forecast) {
            return forecast.json()
        })
        .then(function (forecastdata) {
            console.log(forecastdata);
            for (var i = 0; i < 5; i++) {
                const forecastIndex = ((i + 1) * 8) - 1;
                var fDate = new Date((forecastdata.list[forecastIndex].dt) * 1000);
                var fDateEl = ('0' + (fDate.getMonth() + 1)).slice(-2) + '/' + ('0' + fDate.getDate()).slice(-2) + '/' + fDate.getFullYear();
                var forecastIconId = forecastdata.list[forecastIndex].weather[0].icon;
                var fTempEl = Math.floor((forecastdata.list[forecastIndex].main.temp - 273) * (9 / 5) + 32);
                var fWindEl = Math.floor((forecastdata.list[forecastIndex].wind.speed) * 2.237)
                var fHumidityEl = forecastdata.list[forecastIndex].main.humidity;
                $('#fDate' + i).html(fDateEl);
                $('#fImg' + i).html(`<img src='./icons/${forecastIconId}.png' />`);
                $('#fTemp' + i).html(fTempEl);
                $('#fWind' + i).html(fWindEl);
                $('#fHumidity' + i).html(fHumidityEl);
            }
        });

}

searchBtn.addEventListener('click', showWeather);

//save search hitory into local storage
var citySearch = document.getElementById('previousSearchBtn');
// var li = document.createElement('li');
function saveCity() {
    var searchHistory = JSON.parse(localStorage.getItem("search"));
    if (searchHistory !== null) {
        JSON.parse(localStorage.getItem("search"));
        console.log(searchHistory)
        for (var i = 0; i < searchHistory.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('type', 'button');
            li.setAttribute('class', 'clickable form-control d-block bg-white');
            li.textContent = searchHistory[i];
            console.log(li.textContent);
            citySearch.append(li);
        }
    }
}
// // function goBackHistory(event) {
// //     var li = event.target;
// //     if (event.target.matches('li')) {
// //         city = li.textContent.trim();
// //         showWeather(city);
// //     }


// $('.clickable').click(goBackHistory);


