
$(document).ready(function(){

    var api = '17a9e463090b33048b8d0e143b013660'
    var cityName = 'Vancouver'
    var lat
    var long
    $.get(`https://nominatim.openstreetmap.org/?q=${cityName}&addressdetails=1&countrycodes=US&format=json&limit=1`, function(response){
        console.log(response)
        lat = response[0].lat;
        long = response[0].lon;
        cityName = `${cityName}, ${response[0].address.state}`
    }).then(function(){
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
        exclude=hourly,daily&appid=${api}`, function(response){
            console.log(response)
            var currentWeather = {}
            currentWeather.name = cityName
            currentWeather.date = moment.unix(response.current.dt).format('L'); 
            currentWeather.icon = `http://openweathermap.org/img/wn/${response.current.weather.icon}.png`
            currentWeather.desc = response.current.weather.description
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
        for (var prop in weather){
            console.log(`${prop} : ${weather[prop]}`)
           $(".currentWeather *").each(function(){
               if($(this).attr("id") === prop){
                   console.log($(this).attr("id"));
                   console.log(prop)
                    $(this).text(weather[prop])
                    console.log($(this))
               }
           })
                
            // var target = $(`.currentWeather)[id=${prop}]`)
            
        }
        
    }
})