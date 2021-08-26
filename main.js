let fallbackLocation = { latitude: 17.5046, longitude: -88.1962 }; // Belize City, Belize -- city
// let fallbackLocation = { latitude: -54.282, longitude: -36.4937 }; // Grytviken, South Georgia and the South Sandwich Islands -- village

function fetchCity(coords) {
    let lat = coords.latitude;
    let long = coords.longitude;
    let key = "f175091c360d4822adb30fa850994eb8"; // I'm keeping this here for now, but hide your keys when you do projects
    fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${key}`
    )
        .then((response) => response.json())
        .then((data) => {
            let components = data.results[0].components;
            console.log(components);
            let townOrCityOrVillage = "";
            if (components.city) {
                townOrCityOrVillage = components.city;
            } else if (components.town) {
                townOrCityOrVillage = components.town;
            } else if (components.village) {
                townOrCityOrVillage = components.village;
            }
            let locationDiv = document.getElementById("location");
            locationDiv.innerText = `${townOrCityOrVillage}, ${components.country}, ${components.continent}`;
            fetchWeather(townOrCityOrVillage);
        });
}

function fetchWeather(location) {
    fetch(`https://goweather.herokuapp.com/weather/${location}`)
        .then((response) => response.json())
        .then((data) => {
            let today = [data.temperature, data.wind, data.description];
            console.log(today);
            displayWeather(today, data.forecast);
        });
}

function displayWeather(todaysWeather, nextThreeDays) {
    let todayDiv = document.getElementById("today");
    let threeDaysDiv = document.getElementById("threeDays");
    let todaysTemp = celsiusToF(parseInt(todaysWeather[0]));
    todayDiv.innerText = `Today, the temperature is ${todaysTemp} °F with ${kmToMiles(
        parseInt(todaysWeather[1])
    )} mph winds and ${todaysWeather[2]} kind of weather.`;
    console.log(nextThreeDays);
    nextThreeDays.forEach((dayForecast) => {
        let dayDiv = document.createElement("div");
        dayDiv.innerText = `In ${
            dayForecast.day
        } day(s), the temperature will be ${celsiusToF(
            parseInt(dayForecast.temperature)
        )} °F with ${kmToMiles(parseInt(dayForecast.wind))} mph winds.`;
        threeDaysDiv.append(dayDiv);
    });
}

function celsiusToF(temp) {
    return Math.round(temp * (9 / 5) + 32);
}

function kmToMiles(wind) {
    return Math.round(wind / 1.609);
}

navigator.geolocation.getCurrentPosition(
    geolocationSuccess,
    geolocationFailure
);

function geolocationSuccess(position) {
    console.log(position.coords);
    fetchCity(position.coords);
}

function geolocationFailure() {
    console.log(
        "Either failed to get location or user blocked location. Will use fallback location..."
    );
    fetchCity(fallbackLocation);
}
