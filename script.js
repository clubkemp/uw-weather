
$(document).ready(function(){
    //declare the open weather API key
    var api = '17a9e463090b33048b8d0e143b013660'
    //TODO: hook up the form input to set this variable
    var cityName = 'Vancouver'
    //declaring lat and long to be used in the open weather onecall
    var lat
    var long

    //jquery get to nominatim to get lat longs of the city
    $.get(`https://nominatim.openstreetmap.org/?q=${cityName}&addressdetails=1&countrycodes=US&format=json&limit=1`, function(response){
        console.log(response)
        //seting the latitude of the city
        lat = response[0].lat;
        //setting the laongitute of the city
        long = response[0].lon;
        //clean up the city name
        cityName = `${cityName}, ${response[0].address.state}`
    }).then(function(){
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
        exclude=hourly,daily&appid=${api}`, function(response){
            //create a current weather opject to send to the build function
            var currentWeather = {}
            //city name
            currentWeather.name = cityName
            //using moment to convert the unix timestap to human date
            currentWeather.date = moment.unix(response.current.dt).format('L');
            //format the icon url to hit the image source from OWM 
            currentWeather.icon = `http://openweathermap.org/img/wn/${response.current.weather.icon}.png`
            //weather description, not used right now but could be fun
            currentWeather.desc = response.current.weather.description
            //current temp converted from K
            currentWeather.temp = (response.current.temp * (9/5) -459.67).toFixed(1);
            //humidity
            currentWeather.humidity = response.current.humidity;
            //wind speed
            currentWeather.wind = response.current.wind_speed;
            //uv index
            currentWeather.uvi = response.current.uvi;
            //send the current weather object to the build function
            buildCurrentWeather(currentWeather)
            
            //setup fiveDay weather by popping off the last 2 peeps
            var fiveDayWeather = response.daily.slice(0,4)
            //buildFiveDayWeather(fivedDayWeather)
        })
        
    })
    //function to build the current weather in the DOM
    function buildCurrentWeather (weather) {
        console.log(weather)
        //iterate over weather, which is an object passed in from our GET request
        for (var prop in weather){
            //now for each object, we need to grab all the DOM elements that are in the current weather section
            console.log(`${prop} : ${weather[prop]}`)
            //* indicated grabbing all children of .currentWeather
            $(".currentWeather *").each(function(){
                //So for each child of currentWeather check if the id attr equals our prop
                if($(this).attr("id") === prop){
                    //set the text of the elemnt to match up the value from the weather object
                    $(this).text(weather[prop])
                    //TODO: update the image to be the iconURL
                }
            })
        }
    }
})