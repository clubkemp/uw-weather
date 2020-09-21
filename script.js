
$(document).ready(function(){

    var api = '17a9e463090b33048b8d0e143b013660'
    var cityName = 'Seattle'
    var lat
    var long
    $.get(`https://nominatim.openstreetmap.org/?q=${cityName}&format=json&limit=1`, function(response){
        console.log(response)
        lat = response[0].lat;
        long = response[0].lon;
    }).then(function(){
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
        exclude=hourly,daily&appid=${api}`, function(response){
            var currentWeather = {}
            currentWeather.date = moment.unix(response.current.dt).format('L'); 
            currentWeather.temp = (response.current.temp * (9/5) -459.67).toFixed(1);
            currentWeather.humidity = response.current.humidity;
            currentWeather.wind = response.current.wind_speed;
            currentWeather.uvi = response.current.uvi;
            buildCurrentWeather(currentWeather)
            var fiveDayWeather = response.daily.slice(0,4)
            //buildFiveDayWeather(fivedDayWeather)
        })
        
    })

    function buildCurrentWeather (weather) {
        console.log(weather)
    }
})