import React from "react";

import { Sunrise, Sunset, Sun, Moon } from "lucide-react";

import "./SunTimeCard.css";

function SunTimeCard() {
  /* =========================================================
     TIME DATA
  ========================================================= */

  const now = new Date();

  const sunrise = new Date(now);

  sunrise.setHours(6, 30, 0, 0);

  const sunset = new Date(now);

  sunset.setHours(18, 45, 0, 0);

  const isDaytime = now >= sunrise && now < sunset;

  /* =========================================================
     DAYLIGHT
  ========================================================= */

  const daylightMs = sunset - sunrise;

  const daylightHours = Math.floor(daylightMs / (1000 * 60 * 60));

  const daylightMinutes = Math.floor(
    (daylightMs % (1000 * 60 * 60)) / (1000 * 60),
  );

  /* =========================================================
     FORMAT
  ========================================================= */

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="sun-card">
      {/* HEADER */}

      <div className="sun-card__header">
        <div className="sun-card__title">
          {isDaytime ? <Sun size={18} /> : <Moon size={18} />}

          <span>Sun Cycle</span>
        </div>

        <div className="sun-card__status">
          {isDaytime ? "Daytime" : "Night"}
        </div>
      </div>

      {/* TIMELINE */}

      <div className="sun-card__timeline">
        <div className="sun-card__line"></div>

        <div className="sun-card__progress"></div>
      </div>

      {/* TIMES */}

      <div className="sun-card__times">
        {/* SUNRISE */}

        <div className="sun-card__item">
          <div className="sun-card__item-top">
            <Sunrise size={16} />

            <span>Sunrise</span>
          </div>

          <strong>{formatTime(sunrise)}</strong>
        </div>

        {/* SUNSET */}

        <div className="sun-card__item">
          <div className="sun-card__item-top">
            <Sunset size={16} />

            <span>Sunset</span>
          </div>

          <strong>{formatTime(sunset)}</strong>
        </div>
      </div>

      {/* INFO */}

      <div className="sun-card__footer">
        <div className="sun-card__metric">
          <span>Daylight</span>

          <strong>
            {daylightHours}h {daylightMinutes}m
          </strong>
        </div>

        <div className="sun-card__metric">
          <span>Current</span>

          <strong>{isDaytime ? "Sun Up" : "Night"}</strong>
        </div>
      </div>
    </div>
  );
}

export default SunTimeCard;
