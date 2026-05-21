import React from "react";

import { SunMedium, ShieldAlert } from "lucide-react";

import "./UVIndexCard.css";

function UVIndexCard({ uvIndex = 7 }) {
  /* =========================================================
     UV LEVELS
  ========================================================= */

  const getUVLevel = (uv) => {
    if (uv < 3)
      return {
        level: "Low",
        color: "#22c55e",
        advice: "Minimal protection required",
      };

    if (uv < 6)
      return {
        level: "Moderate",
        color: "#f59e0b",
        advice: "Use sunscreen outdoors",
      };

    if (uv < 8)
      return {
        level: "High",
        color: "#f97316",
        advice: "Limit direct sun exposure",
      };

    if (uv < 11)
      return {
        level: "Very High",
        color: "#ef4444",
        advice: "Avoid midday sunlight",
      };

    return {
      level: "Extreme",
      color: "#8b5cf6",
      advice: "Stay indoors when possible",
    };
  };

  const uvInfo = getUVLevel(uvIndex);

  /* =========================================================
     SCALE
  ========================================================= */

  const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="uv-card">
      {/* HEADER */}

      <div className="uv-card__header">
        <div className="uv-card__title">
          <SunMedium size={18} />

          <span>UV Index</span>
        </div>

        <div
          className="uv-card__status"
          style={{
            color: uvInfo.color,
          }}
        >
          {uvInfo.level}
        </div>
      </div>

      {/* MAIN */}

      <div className="uv-card__main">
        <div className="uv-card__value">{uvIndex}</div>

        <div className="uv-card__indicator">
          <div className="uv-card__bar">
            <div
              className="uv-card__progress"
              style={{
                width: `${Math.min(uvIndex, 11) * 9}%`,
                background: uvInfo.color,
              }}
            ></div>
          </div>

          <div className="uv-card__scale">
            <span>0</span>
            <span>11+</span>
          </div>
        </div>
      </div>

      {/* ADVICE */}

      <div className="uv-card__advice">
        <ShieldAlert size={16} />

        <div>
          <p>{uvInfo.advice}</p>

          <small>UV intensity changes throughout the day</small>
        </div>
      </div>

      {/* LEVEL BARS */}

      <div className="uv-card__levels">
        {scale.map((uv) => (
          <div
            key={uv}
            className={`uv-card__level-bar ${
              uv <= uvIndex ? "uv-card__level-bar--active" : ""
            }`}
            style={{
              background:
                uv <= 2
                  ? "#22c55e"
                  : uv <= 5
                    ? "#f59e0b"
                    : uv <= 7
                      ? "#f97316"
                      : uv <= 10
                        ? "#ef4444"
                        : "#8b5cf6",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default UVIndexCard;
