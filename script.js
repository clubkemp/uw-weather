console.log("connected")

$(document).ready(function(){

    var api = '17a9e463090b33048b8d0e143b013660'
    var cityName = 'Seattle'
    var lat
    var long
    $.get(`https://nominatim.openstreetmap.org/?q=${cityName}&format=json&limit=1`, function(response){
        console.log(response)
        lat = response[0].lat;
        long = response[0].lon
    }).then(function(){
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
        exclude=hourly,daily&appid=${api}`, function(response){
            console.log(response);
            var uvi = response.current.uvi
        })
        
    })

// $.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api}`, function (response){
//     console.log(response)
//     console.log(response.name)
    
//     var date = moment.unix(response.dt).format('L')
//     console.log(date)

//     var temp = response.main.temp * (9/5) -459.67
//     console.log(temp.toFixed(1));
//     var humidity = response.main.humidity;
//     var wind = response.wind.speed

//     lat = response.coord.lat;
//     long = response.coord.lon;

//     // buildCurrentWeather(date, temp, humidity, wind)
// }).then( function(){
//     $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
//     exclude=hourly,daily&appid=${api}`, function(response){
//         console.log(response);
//     })
//     var uvi = response.current.uvi

// })
})