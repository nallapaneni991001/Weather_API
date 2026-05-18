const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ===== CONFIG =====
const WEATHER_API_KEY = 'Yor API Key here';
const COLD_THRESHOLD_C = 10;
const COLD_THRESHOLD_F = 50;

// ===== WEATHER FUNCTION =====
async function getWeather(city) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return {
      success: true,
      city: response.data.name,
      temp_c: response.data.main.temp,
      temp_f: (response.data.main.temp * 9/5) + 32,
      condition: response.data.weather[0].description
    };
  } catch (error) {
    return { success: false, error: 'City not found or API error' };
  }
}

// ===== SMS FUNCTION (simulated - logs only) =====
function sendSMS(phone, city, temp_c) {
  const message = `❄️ Cold weather alert! ${city} is ${temp_c}°C (below 10°C). Don't forget your coat!`;
  console.log(`\n📱 SMS TO ${phone}: ${message}\n`);
  return true;
}

// ===== MAIN WEBHOOK =====
app.post('/webhook/weather-cold-alert', async (req, res) => {
  console.log('\n📞 Call received:', req.body);
  
  const { city, phone } = req.body;
  
  if (!city) {
    return res.json({ 
      success: false, 
      message: "I need a city name. Please tell me your city." 
    });
  }
  
  // Get weather
  const weather = await getWeather(city);
  
  if (!weather.success) {
    return res.json({
      success: false,
      message: `Sorry, I couldn't find weather for ${city}. Can you say the city name again?`
    });
  }
  
  // Check if cold and send SMS
  let smsSent = false;
  if (weather.temp_c < COLD_THRESHOLD_C) {
    if (phone) {
      sendSMS(phone, weather.city, weather.temp_c);
      smsSent = true;
    }
  }
  
  // Build voice response
  let voiceMessage = `${weather.city} is ${weather.temp_c}°C with ${weather.condition}. `;
  
  if (weather.temp_c < COLD_THRESHOLD_C) {
    voiceMessage += `It's cold! ${smsSent ? 'I sent you a text reminder to bring a coat.' : 'I would send a coat reminder but I need your phone number.'}`;
  } else {
    voiceMessage += `Temperature is above 10 degrees. No coat needed today!`;
  }
  
  res.json({
    success: true,
    message: voiceMessage,
    sms_sent: smsSent,
    temp_c: weather.temp_c
  });
});

// ===== TEST ENDPOINTS =====
app.get('/test', async (req, res) => {
  const weather = await getWeather('London');
  res.json(weather);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', cold_threshold: `${COLD_THRESHOLD_C}°C` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Weather Cold Alert Bot Running`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌡️  Cold threshold: ${COLD_THRESHOLD_C}°C\n`);
});
