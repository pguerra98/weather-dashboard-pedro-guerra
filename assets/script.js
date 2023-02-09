let searchprevious = []

let lastCitySearched = ""

let loadsearchprevious = function() {

    searchprevious = JSON.parse(localStorage.getItem("weathersearchprevious"));

    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));

    if (!searchprevious) {

        searchprevious = []

    }

    if (!lastCitySearched) {

        lastCitySearched = ""

    }

    $("#searchprevious").empty();

    for(i = 0 ; i < searchprevious.length ;i++) {

        $("#searchprevious").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchprevious[i] + "'>" + searchprevious[i] + "</a>");

    }
  };

// The function below will take in the user's input for a city

let getCityWeather = function(city) {

    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    fetch(apiUrl)
        
        .then(function(response) {

            if (response.ok) {

                response.json().then(function(data) {

                    displayWeather(data);

                });

            } else {

                alert("Error: " + response.statusText);

            }

        })  

};

// The function below will take in the user's input for a city

let searchSubmitHandler = function(event) {

    event.preventDefault();

    let cityName = $("#cityname").val().trim();

    if(cityName) {

        getCityWeather(cityName);

        $("#cityname").val("");
        
    } else {

        alert("Please enter a city name");

    }

};


if (lastCitySearched != ""){

    getCityWeather(lastCitySearched);

}

$("#search-form").submit(searchSubmitHandler);

$("#searchprevious").on("click", function(event){

    let prevCity = $(event.target).closest("a").attr("id");

    getCityWeather(prevCity);

});

// The function below will storage the previous cities searched

let savesearchprevious = function (city) {

    if(!searchprevious.includes(city)){

        searchprevious.push(city);

        $("#searchprevious").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")

    } 

    localStorage.setItem("weathersearchprevious", JSON.stringify(searchprevious));

    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    loadsearchprevious();
};

loadsearchprevious();

// The function below will bring in all the data from the weather API 

let displayWeather = function(weatherData) {

    $("#city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);

    $("#city-temperature").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");

    $("#city-humidity").text("Humidity: " + weatherData.main.humidity + "%");

    $("#city-windspeed").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")

        .then(function(response) {

            response.json().then(function(data) {

                $("#fd").empty();

                for(i = 4; i <= data.list.length; i += 5){

                    let fiveDayCard =`

                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">

                        <div class="card-body p-1">

                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>

                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">

                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>

                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>

                        </div>

                    </div>

                    `;

                    $("#fd").append(fiveDayCard);
               }

            })

        });

    lastCitySearched = weatherData.name;

    savesearchprevious(weatherData.name);
    
};

