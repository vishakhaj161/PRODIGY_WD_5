const apiKey = '87e2da448b5b2d3a104077554b2e9045'; // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById('weather-info');
const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-input');

// Fetch Weather Data
async function fetchWeather(location) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Location not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfo.innerHTML = `<p>${error.message}</p>`;
    }
}

// Display Weather Data
function displayWeather(data) {
    const { name, sys, main, weather } = data;

    weatherInfo.innerHTML = `
        <p><strong>${name}, ${sys.country}</strong></p>
        <p>Temperature: ${main.temp}°C</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Feels Like: ${main.feels_like}°C</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}

// Handle Search Button Click
searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    } else {
        weatherInfo.innerHTML = '<p>Please enter a location</p>';
    }
});

// Fetch Weather for User's Current Location
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
                )
                    .then((response) => response.json())
                    .then((data) => displayWeather(data))
                    .catch((error) => {
                        weatherInfo.innerHTML = '<p>Unable to fetch your location weather</p>';
                    });
            },
            () => {
                weatherInfo.innerHTML = '<p>Location access denied. Use the search box to find weather.</p>';
            }
        );
    } else {
        weatherInfo.innerHTML = '<p>Geolocation is not supported by your browser</p>';
    }
});
