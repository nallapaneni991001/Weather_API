#!/bin/bash

echo "=== Weather Bot Integration Setup ==="

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
WEATHER_API_KEY=your_key_here
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional
TWILIO_PHONE_NUMBER=optional
PORT=3000
EOF

echo "Created .env file - add your API keys"

# Start server
echo "Starting webhook server..."
npm start &

# Get ngrok URL
echo "Starting ngrok (install if needed: brew install ngrok)"
ngrok http 3000

echo "Copy the ngrok URL (e.g., https://abc123.ngrok.io)"
echo "Paste into Retell webhook configuration"