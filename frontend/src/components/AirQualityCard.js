import React from "react";

import { Wind, Activity } from "lucide-react";

import "./AirQualityCard.css";

function AirQualityCard({ aqi = 45 }) {
  const getAQILevel = (value) => {
    if (value <= 50)
      return {
        level: "Good",
        color: "#22c55e",
        health: "Air quality is satisfactory",
      };

    if (value <= 100)
      return {
        level: "Moderate",
        color: "#f59e0b",
        health: "Acceptable for most individuals",
      };

    if (value <= 150)
      return {
        level: "Sensitive Groups",
        color: "#f97316",
        health: "Sensitive individuals should limit outdoor exposure",
      };

    if (value <= 200)
      return {
        level: "Unhealthy",
        color: "#ef4444",
        health: "Outdoor activity should be reduced",
      };

    return {
      level: "Very Unhealthy",
      color: "#8b5cf6",
      health: "Health alert conditions detected",
    };
  };

  const aqiInfo = getAQILevel(aqi);

  return (
    <div className="aqi-card">
      {/* HEADER */}

      <div className="aqi-header">
        <div className="aqi-title">
          <Wind size={18} />

          <span>Air Quality</span>
        </div>

        <div
          className="aqi-status"
          style={{
            color: aqiInfo.color,
          }}
        >
          {aqiInfo.level}
        </div>
      </div>

      {/* MAIN */}

      <div className="aqi-main">
        <div className="aqi-score">{aqi}</div>

        <div className="aqi-indicator">
          <div className="aqi-bar">
            <div
              className="aqi-progress"
              style={{
                width: `${Math.min(aqi, 300) / 3}%`,
                background: aqiInfo.color,
              }}
            ></div>
          </div>

          <div className="aqi-scale">
            <span>0</span>
            <span>300</span>
          </div>
        </div>
      </div>

      {/* HEALTH */}

      <div className="aqi-health">
        <Activity size={16} />

        <p>{aqiInfo.health}</p>
      </div>

      {/* METRICS */}

      <div className="aqi-metrics">
        <div className="aqi-metric">
          <span>PM2.5</span>

          <strong>12 µg/m³</strong>
        </div>

        <div className="aqi-metric">
          <span>PM10</span>

          <strong>28 µg/m³</strong>
        </div>

        <div className="aqi-metric">
          <span>NO₂</span>

          <strong>15 µg/m³</strong>
        </div>
      </div>
    </div>
  );
}

export default AirQualityCard;
