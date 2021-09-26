var APIKey = 'f4915048342372788a14fb7a2a82d0a6';
var cityName = document.getElementById('cityName');
var searchBtn = document.querySelector('#searchBtn');
var weatherIcon = document.querySelector('.weathericon');
var temperatureEl = document.querySelector('#temperature');
var humidityEl = document.querySelector('#humidity');
var windEl = document.querySelector('#wind-speed');
var uvEl = document.querySelector('#uvColor');
var showEl = document.querySelector('.bigPart')
var nameBig = document.querySelector('#name')

searchBtn.addEventListener('click', showWeather);

function showWeather(city) {
    showEl.removeAttribute('class');
    var city = cityName.value.trim();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    fetch(queryURL).then(function (respond) {
        return respond.json()
    })
        .then(function (data) {
            console.log(data);
            //change weather from Kelvin to Fahrenheit
            var celsius = data.main.temp - 273;
            temperatureEl.textContent = Math.floor(celsius * (9 / 5) + 32);
            windEl.textContent = data.wind.speed;
            var dt = data.dt;
            //convert the dt to get date and hour
            var date = new Date(dt * 1000);
            //Get date and name of the city
            nameBig.textContent = data.name + ' ' + '(' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear() + ')' + '.';
            humidityEl.innerHTML = data.main.humidity;
            var weatherIconId = data.weather[0].icon;
            weatherIcon.innerHTML = `<img src='./icons/${weatherIconId}.png' />`;
            console.log(weatherIcon);
            function getUVIndex() {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var uvindexUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;
                fetch(uvindexUrl).then(function (res) {
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
                        console.log(uvEl);
                    })
            }
            getUVIndex();
        })
}
