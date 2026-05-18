Weather Voice Bot 🌤️
Voice-based weather assistant using Retell AI + Node.js + Weather API + SMS

✨ What It Does
Users call a phone number → ask for weather → get voice response + optional SMS forecast

🏗️ Tech Stack
Retell AI - Voice agent

Express.js - Webhook server (replaces n8n)

OpenWeatherMap - Weather data

Twilio - SMS (optional)

Setup
1. Install dependencies
bash
npm install express axios
2. Add your weather API key
Open server.js and replace:

javascript
const WEATHER_API_KEY = 'your_key_here';
Get a free key from OpenWeatherMap

3. Run the server
bash
node server.js
You should see: Server running on port 3000

4. Test it
bash
curl http://localhost:3000/test
5. Expose to the internet (for Retell)
bash
ngrok http 3000
Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

6. Set up Retell
Go to Retell AI

Create a new Agent

Set webhook URL to: https://your-ngrok-url.ngrok.io/webhook/weather-sms

Add this prompt:

text
Ask user for city. Get weather. Read it back. Keep it short.
Get a phone number from Retell

Call it and say: "Weather in London"

API endpoints
Endpoint	Method	Use
/health	GET	Check if server is running
/test	GET	Test weather API
/webhook/weather-sms	POST	Main webhook for Retell
Test the webhook manually
bash
curl -X POST http://localhost:3000/webhook/weather-sms \
  -H "Content-Type: application/json" \
  -d '{"city":"London"}'
Files
server.js - Main server code

package.json - Dependencies

Common problems
Server won't start - Port 3000 is busy. Change it in the code.

Weather API returns error - Key might be new. Wait 1-2 hours.

Retell can't connect - Make sure ngrok is still running.
