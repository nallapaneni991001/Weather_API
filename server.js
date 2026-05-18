const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const WEATHER_API_KEY = 'c66178d3af22f90183ae00b112e3068f';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city) {
  try {
    console.log(`Fetching weather for: ${city}`);
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    const data = response.data;
    return {
      success: true,
      city: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed
    };
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Weather API error'
    };
  }
}

app.post('/webhook/weather-sms', async (req, res) => {
  console.log('\n=== Received webhook call ===');
  console.log('Body:', req.body);
  
  const { city, phone, carrier = 'att' } = req.body;
  
  if (!city) {
    return res.status(400).json({
      error: 'Missing city parameter',
      message: 'Please provide a city name'
    });
  }
  
  const weather = await getWeather(city);
  
  if (!weather.success) {
    return res.status(500).json({
      error: weather.error,
      message: `Could not get weather for ${city}`
    });
  }
  
  const weatherText = `${weather.city}: ${weather.temp}°C, ${weather.condition}. Feels like ${weather.feels_like}°C. Humidity ${weather.humidity}%.`;
  
  if (phone) {
    console.log(`\n[SMS WOULD BE SENT]`);
    console.log(`To: ${phone}`);
    console.log(`Message: Weather update for ${weather.city}: ${weather.temp}°C, ${weather.condition}`);
  }
  
  res.json({
    success: true,
    weather_text: weatherText,
    sms_sent: phone ? true : false,
    sms_method: phone ? 'logged' : 'none',
    full_forecast: weatherText
  });
  
  console.log('\n=== Response sent ===');
  console.log(weatherText);
});

// HEALTH CHECK ENDPOINT
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TEST ENDPOINT - This is what you're trying to access
app.get('/test', async (req, res) => {
  console.log('Test endpoint called');
  const weather = await getWeather('London');
  res.json(weather);
});

// ROOT ENDPOINT - So you don't get "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ 
    message: 'Weather Bot Server Running',
    endpoints: {
      test: 'GET /test',
      health: 'GET /health',
      webhook: 'POST /webhook/weather-sms'
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`✅ Weather bot running on port ${PORT}`);
  console.log(`=================================`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/weather-sms`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
  console.log(`Health URL: http://localhost:${PORT}/health`);
  console.log(`=================================\n`);
});
