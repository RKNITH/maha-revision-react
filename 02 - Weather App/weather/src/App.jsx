import React, { useState } from "react";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    const apiKey = "33d9c89bd813247536f05eb59ddd5a58";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        setWeather({
          temperature: `${Math.round(data.main.temp)}°C`,
          feelsLike: `${Math.round(data.main.feels_like)}°C`,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} m/s`,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          city: data.name,
          country: data.sys.country,
        });
        setError("");
      } else {
        setError("City not found. Please try again.");
        setWeather(null);
      }
    } catch (error) {
      setError("Error fetching data. Please try again.");
      setWeather(null);
    }
  };

  return (
    <div className="bg-blue-200 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Weather App</h1>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Show Weather
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {weather && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">{weather.city}, {weather.country}</h2>
            <img src={weather.icon} alt="Weather icon" className="mx-auto" />
            <p className="text-lg font-semibold">{weather.description}</p>
            <p className="text-xl">{weather.temperature} (Feels like {weather.feelsLike})</p>
            <p>Humidity: {weather.humidity}</p>
            <p>Wind Speed: {weather.windSpeed}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
