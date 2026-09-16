let selectedPlace = null;


// =================================
// SEARCH PLACE SUGGESTIONS
// =================================

async function searchPlaces() {

    const city =
        document.getElementById("city").value.trim();

    const suggestions =
        document.getElementById("suggestions");


    if (city.length < 2) {

        suggestions.innerHTML = "";

        return;
    }


    try {

        const response = await fetch(

            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`

        );


        const data =
            await response.json();


        suggestions.innerHTML = "";


        if (!data.results) {

            return;
        }


        data.results.forEach(place => {

            const item =
                document.createElement("div");


            item.className =
                "suggestion";


            item.innerText =
                `📍 ${place.name}, ${place.country}`;


            item.onclick = function () {

                document.getElementById("city").value =
                    place.name;

                selectedPlace = place;

                suggestions.innerHTML = "";

            };


            suggestions.appendChild(item);

        });

    }

    catch (error) {

        console.log(error);

    }

}


// =================================
// GET WEATHER
// =================================

async function getWeather() {

    const city =
        document.getElementById("city").value.trim();


    if (city === "") {

        alert("Please enter a city name");

        return;

    }


    try {

        document.getElementById("condition").innerText =
            "Loading...";


        let location;


        // If user selected a suggestion
        if (selectedPlace) {

            location = selectedPlace;

        }

        // Otherwise search city
        else {

            const locationResponse =
                await fetch(

                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`

                );


            const locationData =
                await locationResponse.json();


            if (
                !locationData.results ||
                locationData.results.length === 0
            ) {

                alert("City not found");

                return;

            }


            location =
                locationData.results[0];

        }


        // =================================
        // WEATHER API
        // =================================

        const weatherResponse =
            await fetch(

                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`

            );


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        // =================================
        // CURRENT WEATHER
        // =================================

        document.getElementById("city-name").innerText =
            `${location.name}, ${location.country}`;


        document.getElementById("temperature").innerText =
            `${current.temperature_2m} °C`;


        document.getElementById("feels-like").innerText =
            `Feels Like: ${current.apparent_temperature} °C`;


        document.getElementById("humidity").innerText =
            `Humidity: ${current.relative_humidity_2m}%`;


        document.getElementById("wind").innerText =
            `Wind: ${current.wind_speed_10m} km/h`;


        document.getElementById("condition").innerText =
            getWeatherCondition(
                current.weather_code
            );


        // =================================
        // 7 DAY FORECAST
        // =================================

        showForecast(
            weatherData.daily
        );


        selectedPlace = null;

    }

    catch (error) {

        console.log(error);

        alert(
            "Weather data could not be loaded."
        );

    }

}


// =================================
// 7 DAY FORECAST
// =================================

function showForecast(daily) {

    const forecast =
        document.getElementById("forecast");


    forecast.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const date =
            new Date(daily.time[i]);


        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const icon =
            getWeatherIcon(
                daily.weather_code[i]
            );


        const maxTemp =
            Math.round(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            Math.round(
                daily.temperature_2m_min[i]
            );


        const card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <span class="forecast-day">
                ${day}
            </span>

            <span class="forecast-icon">
                ${icon}
            </span>

            <span class="forecast-temp">
                ${maxTemp}° / ${minTemp}°
            </span>

        `;


        forecast.appendChild(card);

    }

}


// =================================
// WEATHER CONDITION
// =================================

function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "⛅ Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️ Fog";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Unknown";
}


// =================================
// WEATHER ICON
// =================================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code >= 1 && code <= 3) {
        return "⛅";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}
