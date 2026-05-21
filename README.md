# WeatherPro

WeatherPro is a modern weather intelligence web application that provides real-time weather updates, hourly and 7-day forecasts, AI-powered insights, and location-based weather details in a clean, responsive interface.

## Features

- Real-time current weather.
- Search weather by city name.
- Detect current location using geolocation.
- Toggle between Celsius and Fahrenheit.
- Hourly temperature chart.
- 7-day weather forecast.
- UV index information.
- Sunrise and sunset details.
- Air quality display.
- AI-based clothing advice.
- AI-based activity suggestions.
- Light and dark theme support.
- Responsive UI for desktop and mobile.

## Tech Stack

### Frontend
- React
- Axios
- Framer Motion
- Lucide React
- CSS

### Backend
- Node.js
- Express

### APIs and Data
- OpenWeather API
- Geocoding API

### Optional / Advanced
- Machine learning or rule-based weather insight logic

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

## Screenshots

_Add screenshots here after running the project._

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- OpenWeather API key

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

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
PORT=5000
```

If you use any other secret keys, add them here as well.

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
2. Search for a city.
3. Use the location button to fetch current location weather.
4. Switch between Celsius and Fahrenheit.
5. View hourly forecasts, 7-day forecasts, and AI insights.

## API Endpoints

### `GET /api/weather`
Fetch current weather, hourly forecast, daily forecast, and AI insights for a location.

### `GET /api/search`
Search for a city and return matching coordinates.

## Folder Overview

### `frontend`
Contains the React UI components, styles, and pages.

### `backend`
Contains the API server, weather fetching logic, and data formatting.

### `ml-model`
Contains any model or logic used for AI-based weather insights.

### `docker`
Contains Docker-related setup files.

## Troubleshooting

- If weather data does not load, check your API key.
- If city search returns a wrong place name, verify the geocoding response.
- If AI insights do not appear in Fahrenheit mode, check the unit handling in backend and frontend.
- If the app does not start, make sure backend and frontend are both running.

## Future Improvements

- Add weather alerts.
- Add saved favorite cities.
- Add charts for humidity, wind, and pressure.
- Improve AI clothing recommendations.
- Add login and user preferences.
- Deploy the app online.

## License

This project is for educational and personal use.

## Author

D Vaishnavi
