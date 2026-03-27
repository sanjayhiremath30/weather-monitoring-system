import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Normalization Service: Maps OpenWeatherMap data to the dashboard's expected format (WeatherAPI.com style)
 */
function normalizeWeatherData(current, forecastData, airPollution) {
  // Mapping current weather
  const normalized = {
    location: {
      name: current.name,
      country: current.sys.country,
      localtime: new Date(current.dt * 1000).toISOString(),
    },
    current: {
      last_updated: new Date(current.dt * 1000).toISOString(),
      temp_c: current.main.temp,
      feelslike_c: current.main.feels_like,
      condition: {
        text: current.weather[0].main,
        icon: `//openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
      },
      wind_kph: current.wind.speed * 3.6,
      wind_dir: `${current.wind.deg}°`,
      pressure_mb: current.main.pressure,
      humidity: current.main.humidity,
      vis_km: current.visibility / 1000,
      uv: 1.0, // Default for free tier
      gust_kph: current.wind.speed * 4.5, // Estimate
      air_quality: airPollution ? {
        pm2_5: airPollution.list[0].components.pm2_5,
        pm10: airPollution.list[0].components.pm10,
        o3: airPollution.list[0].components.o3,
        no2: airPollution.list[0].components.no2,
      } : null,
    },
    forecast: {
      forecastday: []
    },
    alerts: null
  };

  // Grouping 5/3 forecast into days
  const dailyData = {};
  forecastData.list.forEach(item => {
    const dateStr = item.dt_txt.split(' ')[0];
    if (!dailyData[dateStr]) dailyData[dateStr] = [];
    dailyData[dateStr].push(item);
  });

  // Take first 3 days for the dashboard
  const dayKeys = Object.keys(dailyData).slice(0, 3);
  
  normalized.forecast.forecastday = dayKeys.map(dateKey => {
    const hours = dailyData[dateKey];
    const temps = hours.map(h => h.main.temp);
    
    return {
      date: dateKey,
      day: {
        maxtemp_c: Math.max(...temps),
        mintemp_c: Math.min(...temps),
        avgtemp_c: temps.reduce((a, b) => a + b) / temps.length,
        maxwind_kph: Math.max(...hours.map(h => h.wind.speed)) * 3.6,
        daily_chance_of_rain: Math.max(...hours.map(h => h.pop)) * 100,
        avghumidity: hours.reduce((a, b) => a + b.main.humidity, 0) / hours.length,
        uv: 1.0,
        condition: {
          text: hours[0].weather[0].main,
          icon: `//openweathermap.org/img/wn/${hours[0].weather[0].icon}@2x.png`,
        }
      },
      astro: {
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      hour: hours.map(h => ({
        time: h.dt_txt,
        temp_c: h.main.temp,
        condition: {
          text: h.weather[0].main,
          icon: `//openweathermap.org/img/wn/${h.weather[0].icon}.png`,
        }
      }))
    };
  });

  return normalized;
}

/**
 * Fetch unified weather data for a city
 */
export async function getUnifiedWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  try {
    console.log(`[WeatherService] Fetching unified weather for ${city}...`);
    
    // 1. Current Weather
    const currentRes = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: apiKey, units: 'metric' }
    });
    
    // 2. 5/3 Forecast
    const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: apiKey, units: 'metric' }
    });

    // 3. Air Pollution (Lat/Lon based)
    const { lat, lon } = currentRes.data.coord;
    const pollutionRes = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: apiKey }
    });

    return {
      success: true,
      data: normalizeWeatherData(currentRes.data, forecastRes.data, pollutionRes.data)
    };
  } catch (error) {
    console.error(`[WeatherService] Unified fetch failed for ${city}: ${error.message}`);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/**
 * Batch processing fetch (Original functionality preserved for OrderService)
 */
export async function fetchWeatherWithRetry(city, retries = 3) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: { q: city, appid: apiKey, units: 'metric' },
        timeout: 5000
      });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response && [401, 404].includes(error.response.status)) return { success: false, error: error.response.data.message };
      if (attempt === retries) return { success: false, error: 'Maximum retry attempts reached' };
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }
}
