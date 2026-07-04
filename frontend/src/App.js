// src/App.js

import React, { useState, useEffect } from "react";

import axios from "axios";
if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
}
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import "./App.css";

import TemperatureChart from "./components/TemperatureChart";
import UVIndexCard from "./components/UVIndexCard";
import SunTimeCard from "./components/SunTimeCard";
import AirQualityCard from "./components/AirQualityCard";
import SevenDayForecast from "./components/SevenDayForecast";
import ThemeToggle from "./components/ThemeToggle";

/* =========================================================
   WEATHER ICONS
========================================================= */

const getWeatherIcon = (main) => {
  const icons = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Snow: CloudSnow,
    Thunderstorm: CloudLightning,
    Drizzle: CloudRain,
    Mist: CloudFog,
    Fog: CloudFog,
    Haze: CloudFog,
  };

  return icons[main] || Sun;
};

/* =========================================================
   CITY FIX
========================================================= */

const normalizeCityName = (name) => {
  if (!name) return "";

  const overrides = {
    Chinchpokli: "Mumbai",
    "Parliament House": "Delhi",
  };

  return overrides[name] || name;
};

function App() {
  /* =========================================================
     STATE
  ========================================================= */

  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [searching, setSearching] = useState(false);

  const [units, setUnits] = useState("metric");

  const [theme, setTheme] = useState("dark");

  const [location, setLocation] = useState({
    lat: 17.385,
    lon: 78.4867,
  });

  /* =========================================================
     APPLY THEME
  ========================================================= */

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  /* =========================================================
     FETCH WEATHER
  ========================================================= */

  const fetchWeather = async (lat, lon) => {
    setLoading(true);

    setError(null);

    try {
      const response = await axios.get("/api/weather", {
        params: {
          lat,
          lon,
          units,
        },
      });

      setWeather(response.data);
    } catch (err) {
      console.error(err);

      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, [location, units]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setSearching(true);

    try {
      const response = await axios.get("/api/search", {
        params: {
          q: searchQuery,
        },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];

        setLocation({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        });

        setSearchQuery("");
      } else {
        setError("City not found");
      }
    } catch (err) {
      console.error(err);

      setError("Search failed");
    } finally {
      setSearching(false);
    }
  };

  /* =========================================================
     GEOLOCATION
  ========================================================= */

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },

      () => {
        setError("Unable to get location");
      },
    );
  };

  /* =========================================================
     TOGGLE UNITS
  ========================================================= */

  const handleToggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  /* =========================================================
     VARIABLES
  ========================================================= */

  const unitSymbol = units === "metric" ? "°C" : "°F";

  const weatherMain = weather?.current?.weather?.main || "Clear";

  const WeatherIcon = getWeatherIcon(weatherMain);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="app">
      <div className="app__content">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.header
          className="app__header"
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          {/* BRAND */}

          <div className="app__brand">
            <div className="brand-top">
              <img
                src="/snow.png"
                alt="WeatherPro Logo"
                className="brand-logo"
              />

              <h2>WeatherPro</h2>
            </div>

            <span>Real-time climate intelligence</span>
          </div>

          {/* RIGHT */}

          <div className="app__header-right">
            {/* SEARCH */}

            <form className="search-bar" onSubmit={handleSearch}>
              <Search size={18} className="search-icon" />

              <input
                type="text"
                placeholder="Search city"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button type="submit" disabled={searching}>
                {searching ? "..." : "Search"}
              </button>
            </form>

            {/* CONTROLS */}

            <div className="header-controls">
              <ThemeToggle
                theme={theme}
                onToggle={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
              />

              <button className="icon-btn" onClick={handleGeolocation}>
                <MapPin size={18} />
              </button>

              <button className="unit-btn" onClick={handleToggleUnits}>
                {unitSymbol}
              </button>
            </div>
          </div>
        </motion.header>

        {/* =====================================================
            ERROR
        ===================================================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-banner"
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            LOADING
        ===================================================== */}

        <AnimatePresence>
          {loading && (
            <motion.div
              className="loading-state"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <div className="spinner"></div>

              <p>Loading weather data...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        {weather && !loading && (
          <main className="dashboard">
            {/* =================================================
                HERO CARD
            ================================================= */}

            <motion.section
              className="hero-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {/* LEFT */}

              <div className="hero-left">
                <div className="hero-location">
                  <MapPin size={16} />

                  <span>
                    {normalizeCityName(weather.location.name)},{" "}
                    {weather.location.country}
                  </span>
                </div>

                <div className="hero-temp">
                  <h1>
                    {Math.round(weather.current.temp)}
                    {unitSymbol}
                  </h1>

                  <span>{weather.current.weather.description}</span>
                </div>

                <div className="hero-updated">
                  Updated{" "}
                  {new Date(weather.current.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* RIGHT */}

              <div className="hero-right">
                <div
                  className={`weather-icon ${
                    weatherMain === "Clear"
                      ? "weather-icon--sun"
                      : weatherMain === "Rain" || weatherMain === "Drizzle"
                        ? "weather-icon--rain"
                        : weatherMain === "Thunderstorm"
                          ? "weather-icon--storm"
                          : "weather-icon--cloud"
                  }`}
                >
                  <WeatherIcon size={120} strokeWidth={1.8} />
                </div>
              </div>
            </motion.section>

            {/* =================================================
                METRICS GRID
            ================================================= */}

            <section className="metrics-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <Wind size={18} />

                  <span>Wind</span>
                </div>

                <h3>{weather.current.wind_speed} m/s</h3>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <Droplets size={18} />

                  <span>Humidity</span>
                </div>

                <h3>{weather.current.humidity}%</h3>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <Eye size={18} />

                  <span>Visibility</span>
                </div>

                <h3>
                  {weather.current.visibility
                    ? `${(weather.current.visibility / 1000).toFixed(1)} km`
                    : "N/A"}
                </h3>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <Gauge size={18} />

                  <span>Pressure</span>
                </div>

                <h3>{weather.current.pressure} hPa</h3>
              </div>
            </section>

            {/* =================================================
                TEMPERATURE CHART
            ================================================= */}

            {weather.hourly && (
              <TemperatureChart hourly={weather.hourly} units={units} />
            )}

            {/* =================================================
                EXTRA INFO
            ================================================= */}

            <section className="extra-grid">
              <UVIndexCard uvIndex={weather.current.uvi || 7} />

              <SunTimeCard />

              <AirQualityCard aqi={45} />
            </section>

            {/* =================================================
                FORECAST
            ================================================= */}

            {weather.daily && weather.daily.length > 0 && (
              <SevenDayForecast daily={weather.daily} />
            )}
            {/* =================================================
    AI INSIGHTS
================================================= */}

            {weather.aiInsights && (
              <motion.section
                className="ai-insights"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                {/* =================================================
        HEADER
    ================================================= */}

                <div className="ai-insights__header">
                  <div>
                    <h3>AI Weather Insights</h3>

                    <p>
                      Smart recommendations based on live weather conditions
                    </p>
                  </div>

                  <div className="ai-insights__badge">LIVE AI</div>
                </div>

                {/* =================================================
        SUMMARY
    ================================================= */}

                <div className="ai-insights__summary">
                  <div className="summary-glow"></div>

                  <h4>Today's Overview</h4>

                  <p>{weather.aiInsights.summary}</p>
                </div>

                {/* =================================================
        INSIGHT GRID
    ================================================= */}

                <div className="ai-insights__grid">
                  {/* =============================================
          CLOTHING
      ============================================= */}

                  <div className="insight-card">
                    <div className="insight-card__icon clothing">👕</div>

                    <div className="insight-card__content">
                      <span className="insight-label">Clothing Advice</span>

                      <h4>
                        {weather.aiInsights.clothing?.recommendation ||
                          (units === "imperial"
                            ? "Wear light breathable layers suitable for warm weather."
                            : "Comfortable weather for casual outdoor clothing.")}
                      </h4>

                      <div className="insight-tags">
                        {(weather.aiInsights.clothing?.items?.length
                          ? weather.aiInsights.clothing.items
                          : units === "imperial"
                            ? [
                                "Breathable T-shirt",
                                "Light Jacket",
                                "Sneakers",
                                "UV Protection",
                              ]
                            : [
                                "Casual Wear",
                                "Comfort Fit",
                                "Hydration",
                                "Outdoor Friendly",
                              ]
                        ).map((item, index) => (
                          <span key={index} className="insight-tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* =============================================
          ACTIVITIES
      ============================================= */}

                  <div className="insight-card">
                    <div className="insight-card__icon activity">🏃</div>

                    <div className="insight-card__content">
                      <span className="insight-label">
                        Activity Suggestions
                      </span>

                      <h4>
                        {weather.aiInsights.activities?.recommendation ||
                          "Ideal conditions for outdoor activities and short walks."}
                      </h4>

                      <ul className="insight-list">
                        {(weather.aiInsights.activities?.outdoor?.length
                          ? weather.aiInsights.activities.outdoor.slice(0, 3)
                          : ["Morning Walk", "Cycling", "Outdoor Photography"]
                        ).map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* =============================================
          HEALTH
      ============================================= */}

                  <div className="insight-card">
                    <div className="insight-card__icon health">❤️</div>

                    <div className="insight-card__content">
                      <span className="insight-label">Health Advisory</span>

                      <h4>
                        Stay hydrated and monitor exposure during peak sunlight
                        hours.
                      </h4>

                      <div className="health-metrics">
                        <div className="health-pill">
                          UV {weather.current.uvi || 7}
                        </div>

                        <div className="health-pill">AQI 45</div>

                        <div className="health-pill">
                          Wind {weather.current.wind_speed} m/s
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =============================================
          TRAVEL
      ============================================= */}

                  <div className="insight-card">
                    <div className="insight-card__icon travel">✈️</div>

                    <div className="insight-card__content">
                      <span className="insight-label">Travel Conditions</span>

                      <h4>
                        Visibility and weather conditions are currently stable
                        for travel.
                      </h4>

                      <div className="travel-status">
                        <span className="travel-pill travel-pill--good">
                          Smooth Commute
                        </span>

                        <span className="travel-pill">Low Rain Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
