const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch(error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }

});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }
    return await response.json();
}

function titleCase(str) {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

function displayWeatherInfo(data) {
    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}`;
    descDisplay.textContent = titleCase(description);
    weatherEmoji.textContent = getWeatherEmoji(id);
    
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    animateWeatherEmoji(weatherEmoji.textContent);
}

function animateWeatherEmoji(emoji) {
    const explosionContainer = document.createElement("div");
    explosionContainer.classList.add("explosion");

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement("span");
        particle.textContent = emoji;
        particle.classList.add("particle");
        explosionContainer.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100 + 50;

        particle.style.setProperty("--x", Math.cos(angle) * distance + "px");
        particle.style.setProperty("--y", Math.sin(angle) * distance + "px");
        particle.style.animationDelay = Math.random() * 0.2 + "s";
    }

    card.appendChild(explosionContainer);

    setTimeout(() => {
        explosionContainer.remove();
    }, 1000);
}


function getWeatherEmoji(weatherId) {
    switch(true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}