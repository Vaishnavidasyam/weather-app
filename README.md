# WeatherPro

WeatherPro is a real-time weather intelligence application that shows current weather, hourly forecast, 7-day forecast, air quality, UV index, sunrise/sunset time, temperature charts, and AI-based clothing and activity suggestions.

## Features

- Real-time current weather.
- City search with location lookup.
- Current location detection using geolocation.
- Celsius/Fahrenheit toggle.
- Hourly temperature chart.
- 7-day weather forecast.
- UV index card.
- Sunrise and sunset card.
- Air quality information.
- AI insights for clothing advice and activity suggestions.
- Light and dark theme support.

## Tech Stack

- Frontend: React, Axios, Framer Motion, Lucide React
- Backend: Node.js / Express
- Weather API: OpenWeather
- ML/AI: Custom weather insight logic
- Styling: CSS

## Project Structure

```bash
weather-app/
├── backend/
├── frontend/
├── ml-model/
├── docker/
├── .github/
└── README.md
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Add environment variables

Create a `.env` file inside the backend folder and add your API keys:

```env
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
```

### 5. Run the backend

```bash
cd backend
npm start
```

### 6. Run the frontend

```bash
cd frontend
npm start
```

## Usage

1. Open the app in your browser.
2. Search for any city.
3. Switch between Celsius and Fahrenheit.
4. Use the location icon to fetch your current weather.
5. View hourly charts, 7-day forecast, and AI insights.

## Environment Variables

- `OPENWEATHER_API_KEY`: API key for weather data.
- `PORT`: Backend server port.

## Notes

- Make sure backend and frontend are running at the same time.
- If AI insights do not appear, check the backend response structure.
- The app is designed to support both metric and imperial units.

## License

This project is for educational and personal use.

## Author

D Vaishnavi
