var api = '17a9e463090b33048b8d0e143b013660'
//TODO: hook up the form input to set this variable
var cityName = localStorage.getItem("city")
//declaring lat and long to be used in the open weather onecall
var lat
var long

$(document).ready(function(){
    //declare the open weather API key
    $("button").on("click", function(){
        event.preventDefault()
        cityName = $("input").val()
        getData();
        localStorage.setItem("city", cityName)
        buildCity(cityName);
    })
    $(document).on("click",".city", function(){
        cityName = ($(this).text());
        getData();
        localStorage.setItem("city", cityName)
        buildCity(cityName)
    })
    $(document).on("DOMSubtreeModified","#uvi", function(){
        var uvi = $("#uvi").text()
        
        console.log(uvi);
        if(uvi < 3){
            $(this).attr("class","low")
        }
        else if(uvi >=3 && uvi<=5){
            $(this).attr("class","moderate")
        }else if(uvi >5 && uvi<=7){
            $(this).attr("class","high")
        }else if (uvi >7 && uvi<=10){
            $(this).attr("class", "very-high")
        }else{
            $(this).attr("class","extreme")
        }
    })

    function buildCity (city) {
        function build (city) {
            var cityDiv = $("<div class='city'>")
            cityDiv.attr("id", city)
            var nameH3 = $("<h3>")
            nameH3.text(city)
            cityDiv.append(nameH3)
            $(".city-bucket").prepend(cityDiv);
        }
        console.log(city)
        var firstRun = $(".city-bucket").children().length
        if(firstRun < 1){
            build(city);
        }
        if ($('#'+city).length){
            console.log(city)
            
        }else{
            build(city)
        }
    };
    //jquery get to nominatim to get lat longs of the city
    function getData () {
        $.get(`https://nominatim.openstreetmap.org/?q=${cityName}&addressdetails=1&countrycodes=US&format=json&limit=1`, function(response){
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
                currentWeather.icon = `http://openweathermap.org/img/wn/${response.current.weather[0].icon}.png`
                //weather description, not used right now but could be fun
                currentWeather.desc = response.current.weather[0].description
                //current temp converted from K
                currentWeather.temp = (response.current.temp * (9/5) -459.67).toFixed(1);
                //humidity
                currentWeather.humidity = response.current.humidity;
                //wind speed
                currentWeather.wind = response.current.wind_speed;
                //uv index
                currentWeather.uvi = response.current.uvi;
                //send the current weather object to the build function
                buildCurrent(currentWeather)
                
                //setup fiveDay weather by popping off the last 2 peeps
                var fiveDayWeather = response.daily.slice(1,6)
                buildForcast(fiveDayWeather)
            })
            
        })
    
    }
    
    //function to build the current weather in the DOM
    function buildCurrent (weather) {
        //iterate over weather, which is an object passed in from our GET request
        for (var prop in weather){
            //now for each object, we need to grab all the DOM elements that are in the current weather section
            //* indicated grabbing all children of .currentWeather
            $(".currentWeather *").each(function(){
                //So for each child of currentWeather check if the id attr equals our prop
                if($(this).attr("id") === prop){
                    //set the text of the elemnt to match up the value from the weather object
                    $(this).text(weather[prop])
                }
                if($(this).attr("id") === "icon" ){
                    $(this).attr("src", weather.icon);
                    $(this).attr("alt", weather.desc);
                }   
                
            })
        }
    }

    function buildForcast (forecast){
        $(".card-bucket").empty();
        forecast.forEach(e => {

            var cardDiv = $(`<div class=card >`)
            
            var dateH2 = $(`<h2>`)
            dateH2.text(moment.unix(e.dt).format('L'))
            
            var img = $(`<img>`)
            img.attr("src", `http://openweathermap.org/img/wn/${e.weather[0].icon}.png`)
            img.attr("alt", e.weather[0].description )
            
            var tempP = $(`<p>`)
            tempP.text(`Temperature: ${(e.temp.max * (9/5) -459.67).toFixed(1)}`)
            
            var humidityP = $(`<p>`)
            humidityP.text(`Humidity: ${e.humidity}`)
            
            cardDiv.append(dateH2, img, tempP, humidityP)
            $(".card-bucket").append(cardDiv)
        });          
    }
    //get the whole process started in at the start of page load
    if (cityName){
        getData();
        buildCity(cityName);
    }
    
})
