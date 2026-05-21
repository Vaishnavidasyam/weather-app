import React from "react";

import { motion } from "framer-motion";

import {
  CloudSun,
  CloudRain,
  Cloud,
  Sun,
  CloudFog,
  Snowflake,
  CloudLightning,
} from "lucide-react";

import "./SevenDayForecast.css";

/* =========================================================
   WEATHER ICONS
========================================================= */

const getWeatherIcon = (main) => {
  const icons = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Snow: Snowflake,
    Thunderstorm: CloudLightning,
    Drizzle: CloudRain,
    Mist: CloudFog,
    Fog: CloudFog,
    Haze: CloudFog,
  };

  return icons[main] || CloudSun;
};

/* =========================================================
   WEATHER ICON CLASSES
========================================================= */

const getWeatherIconClass = (main) => {
  switch (main) {
    case "Clear":
      return "forecast__icon forecast__icon--sun";

    case "Rain":
    case "Drizzle":
      return "forecast__icon forecast__icon--rain";

    case "Thunderstorm":
      return "forecast__icon forecast__icon--storm";

    default:
      return "forecast__icon forecast__icon--cloud";
  }
};

function SevenDayForecast({ daily = [] }) {
  /* =========================================================
     FALLBACKS
  ========================================================= */

  const fallbackWeather = [
    "Clear",
    "Clouds",
    "Rain",
    "Clouds",
    "Clear",
    "Clouds",
    "Rain",
  ];

  const fallbackDesc = [
    "Clear sky",
    "Scattered clouds",
    "Light rain",
    "Overcast clouds",
    "Sunny",
    "Cloudy",
    "Rain showers",
  ];

  /* =========================================================
     FORECAST DATA
  ========================================================= */

  const forecastData = Array.from({ length: 7 }, (_, index) => {
    const source = daily?.[index];

    const baseDate = new Date();

    baseDate.setDate(baseDate.getDate() + index);

    const dt = source?.dt || Math.floor(baseDate.getTime() / 1000);

    const weatherObj =
      Array.isArray(source?.weather) && source.weather[0]
        ? source.weather[0]
        : {
            main: fallbackWeather[index % fallbackWeather.length],

            description: fallbackDesc[index % fallbackDesc.length],
          };

    const min = source?.temp?.min ?? 28 + (index % 4);

    const max = source?.temp?.max ?? 36 + (index % 5);

    return {
      dt,
      weatherObj,
      min,
      max,
    };
  });

  /* =========================================================
     HELPERS
  ========================================================= */

  const getDayName = (timestamp, index) => {
    if (index === 0) return "Today";

    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const getDateText = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="forecast">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="forecast__header">
        <h3>7-Day Forecast</h3>

        <span>Weekly outlook</span>
      </div>

      {/* =====================================================
          LIST
      ===================================================== */}

      <div className="forecast__list">
        {forecastData.map((day, index) => {
          const main = day.weatherObj?.main || "Clear";

          const desc = day.weatherObj?.description || main;

          const Icon = getWeatherIcon(main);

          return (
            <motion.div
              key={`${day.dt}-${index}`}
              className={`forecast__item ${
                index === 0 ? "forecast__item--today" : ""
              }`}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              whileHover={{
                y: -4,
              }}
            >
              {/* =================================================
                  DAY
              ================================================= */}

              <div className="forecast__day">
                <strong>{getDayName(day.dt, index)}</strong>

                <span>{getDateText(day.dt)}</span>
              </div>

              {/* =================================================
                  WEATHER
              ================================================= */}

              <div className="forecast__weather">
                <div className={getWeatherIconClass(main)}>
                  <Icon size={30} strokeWidth={2.4} />
                </div>

                <span>{desc}</span>
              </div>

              {/* =================================================
                  TEMPERATURES
              ================================================= */}

              <div className="forecast__temps">
                <span className="forecast__high">{Math.round(day.max)}°</span>

                <span className="forecast__low">{Math.round(day.min)}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default SevenDayForecast;
