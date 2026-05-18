Weather Voice Bot 🌤️
Voice-based weather assistant using Retell AI + Node.js + Weather API + SMS

✨ What It Does
Users call a phone number → ask for weather → get voice response + optional SMS forecast

🏗️ Tech Stack
Retell AI - Voice agent

Express.js - Webhook server (replaces n8n)

OpenWeatherMap - Weather data

Twilio - SMS (optional)

🚀 Quick Start
1. Clone & Install
bash
git clone https://github.com/yourusername/weather-voice-bot.git
cd weather-voice-bot
npm install
2. Add API Key
Edit server.js and add your key:

javascript
const WEATHER_API_KEY = 'your_openweathermap_api_key';
Get free key: OpenWeatherMap

3. Run Server
bash
node server.js
4. Test Locally
bash
# Health check
curl http://localhost:3000/health

# Test webhook
curl -X POST http://localhost:3000/webhook/weather-sms \
  -H "Content-Type: application/json" \
  -d '{"city":"London"}'
5. Expose with ngrok
bash
ngrok http 3000
Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

6. Configure Retell
Go to Retell Dashboard

Create new Agent

Set webhook URL: https://abc123.ngrok.io/webhook/weather-sms

Add this system prompt:

text
You are a weather assistant. Ask user for city, get weather via webhook, read it back. Keep responses short.
Get a phone number from Retell

Call it and say: "What's the weather in London?"

📡 API Endpoints
Endpoint	Method	Purpose
/health	GET	Check server status
/test	GET	Test weather API
/webhook/weather-sms	POST	Main webhook for Retell
📁 Project Structure
text
weather-voice-bot/
├── server.js          # Main server (everything in one file)
├── package.json       # Dependencies
└── README.md          # This file
🧪 Testing Commands
Linux/Mac:

bash
curl -X POST http://localhost:3000/webhook/weather-sms \
  -H "Content-Type: application/json" \
  -d '{"city":"Austin"}'
Windows PowerShell:

powershell
Invoke-RestMethod -Uri "http://localhost:3000/webhook/weather-sms" -Method POST -Body '{"city":"Austin"}' -ContentType "application/json"
💰 Cost Estimates (10K calls/day)
Service	Daily Cost
Retell AI (1 min/call)	$900
Weather API	$10
SMS (Twilio)	$75
Server hosting	$30
Total	~$1,015/day
⚠️ Common Issues
Problem	Fix
"Cannot GET /test"	Server not running or old version
"Unable to connect"	Run node server.js in separate terminal
Weather API 401 error	Wait 1-2 hours after signup for key activation
Retell can't reach webhook	Ensure ngrok is running and URL is correct
🔧 Environment Variables (Optional)
Create .env file:

env
WEATHER_API_KEY=your_key
PORT=3000
USE_SMS=false  # Set true if using Twilio
