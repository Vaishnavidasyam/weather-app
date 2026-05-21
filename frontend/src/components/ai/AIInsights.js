import React from "react";

import {
  FaTshirt,
  FaRunning,
  FaSun,
  FaHome,
  FaHeartbeat,
} from "react-icons/fa";

import "./AIInsights.css";

function AIInsights({ insights, units = "metric" }) {
  if (!insights) return null;

  /* =========================================================
     SAFE FALLBACKS
  ========================================================= */

  const clothing = insights?.clothing || {};

  const activities = insights?.activities || {};

  const health = insights?.health || {};

  const summary =
    insights?.summary ||
    "Weather conditions are stable with moderate atmospheric activity.";

  /* =========================================================
     DEFAULT CLOTHING ADVICE
  ========================================================= */

  const clothingRecommendation =
    clothing?.recommendation ||
    (units === "imperial"
      ? "Light breathable layers are recommended for today's temperature."
      : "Comfortable breathable clothing is ideal today.");

  const clothingItems =
    clothing?.items?.length > 0
      ? clothing.items
      : units === "imperial"
        ? ["T-Shirt", "Sneakers", "Cap", "Light Jacket"]
        : ["Cotton Wear", "Shoes", "Water Bottle", "Sunglasses"];

  /* =========================================================
     ACTIVITIES
  ========================================================= */

  const outdoorActivities =
    activities?.outdoor?.length > 0
      ? activities.outdoor
      : ["Walking", "Cycling", "Photography"];

  const indoorActivities =
    activities?.indoor?.length > 0
      ? activities.indoor
      : ["Reading", "Gym", "Movie Time"];

  /* =========================================================
     HEALTH
  ========================================================= */

  const hydration = health?.hydration || "Stay hydrated throughout the day.";

  const sunProtection =
    health?.sunProtection || "Use sunscreen during peak afternoon hours.";

  return (
    <section className="ai-insights">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="ai-insights__header">
        <div>
          <h3>AI Weather Insights</h3>

          <p>
            Personalized recommendations powered by real-time weather analysis
          </p>
        </div>

        <span className="ai-insights__badge">SMART AI</span>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="ai-insights__summary">
        <p>{summary}</p>
      </div>

      {/* =====================================================
          GRID
      ===================================================== */}

      <div className="ai-insights__cards">
        {/* =================================================
            CLOTHING
        ================================================= */}

        <div className="ai-insights__card">
          <div className="ai-insights__card-icon clothing">
            <FaTshirt size={22} />
          </div>

          <h4>Clothing Advice</h4>

          <p className="ai-insights__main-text">{clothingRecommendation}</p>

          <div className="ai-insights__items">
            {clothingItems.map((item, index) => (
              <span key={index} className="ai-insights__item-tag">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* =================================================
            ACTIVITIES
        ================================================= */}

        <div className="ai-insights__card">
          <div className="ai-insights__card-icon outdoor">
            <FaRunning size={22} />
          </div>

          <h4>Activity Suggestions</h4>

          <div className="ai-insights__activities">
            {/* OUTDOOR */}

            <div className="ai-insights__activity-group">
              <div className="ai-insights__activity-icon">
                <FaSun size={14} />
              </div>

              <strong>Outdoor</strong>

              <ul>
                {outdoorActivities.slice(0, 3).map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>

            {/* INDOOR */}

            <div className="ai-insights__activity-group">
              <div className="ai-insights__activity-icon">
                <FaHome size={14} />
              </div>

              <strong>Indoor</strong>

              <ul>
                {indoorActivities.slice(0, 3).map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* =================================================
            HEALTH
        ================================================= */}

        <div className="ai-insights__card">
          <div className="ai-insights__card-icon health">
            <FaHeartbeat size={22} />
          </div>

          <h4>Health Advisory</h4>

          <ul className="ai-insights__health-list">
            <li>{hydration}</li>

            <li>{sunProtection}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AIInsights;
