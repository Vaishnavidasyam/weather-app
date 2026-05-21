const express = require("express");
const router = express.Router();
const axios = require("axios");

// ML Temperature Prediction (simplified version)
// In production, this would load a trained sklearn model

router.post("/predict", async (req, res) => {
  try {
    const { lat, lon, currentTemp, timeOfDay } = req.body;

    if (!lat || !lon || currentTemp === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Simple ML prediction model (in real app, use trained model)
    // This simulates temperature prediction based on:
    // - Current temperature
    // - Time of day (0-23 hours)
    // - Historical patterns

    const hour = new Date().getHours();
    const timeFactor = timeOfDay || getSeasontimeFactor(hour);

    // Predict next 24 hours
    const predictions = [];
    for (let i = 1; i <= 24; i++) {
      const predictedHour = (hour + i) % 24;
      const timeImpact = getTemperatureImpact(predictedHour);
      const randomVariation = (Math.random() - 0.5) * 2; // ±1°C variation

      const predictedTemp = currentTemp + timeImpact + randomVariation;

      predictions.push({
        hour: i,
        timestamp: Date.now() + i * 3600000,
        predictedTemp: parseFloat(predictedTemp.toFixed(2)),
        confidence: calculateConfidence(i),
      });
    }

    // Find trend
    const avgTemp =
      predictions.reduce((sum, p) => sum + p.predictedTemp, 0) /
      predictions.length;
    const trend =
      avgTemp > currentTemp
        ? "increasing"
        : avgTemp < currentTemp
          ? "decreasing"
          : "stable";

    res.json({
      current: currentTemp,
      predictions,
      trend,
      summary: generatePredictionSummary(
        trend,
        predictions[0].predictedTemp,
        currentTemp,
      ),
    });
  } catch (error) {
    console.error("ML prediction error:", error);
    res
      .status(500)
      .json({ error: "Prediction failed", details: error.message });
  }
});

// Get historical weather data for training (placeholder)
router.get("/historical", async (req, res) => {
  try {
    const { lat, lon, days = 7 } = req.query;

    // In production, fetch from weather API historical endpoint
    // For now, return mock historical data
    const historicalData = [];
    const baseTemp = 28;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      historicalData.push({
        date: date.toISOString().split("T")[0],
        temp_avg: baseTemp + (Math.random() - 0.5) * 4,
        temp_min: baseTemp - 3 + (Math.random() - 0.5) * 2,
        temp_max: baseTemp + 3 + (Math.random() - 0.5) * 2,
        humidity: 60 + (Math.random() - 0.5) * 20,
        condition: ["Clear", "Clouds", "Rain", "Drizzle"][
          Math.floor(Math.random() * 4)
        ],
      });
    }

    res.json({ historicalData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
});

// Helper functions
function getSeasonTimeFactor(hour) {
  // Peak temp around 2-3 PM (14-15), lowest around 5-6 AM
  if (hour >= 14 && hour <= 16) return 1; // Peak
  if (hour >= 5 && hour <= 7) return -1; // Lowest
  if (hour >= 10 && hour <= 12) return 0.5; // Rising
  if (hour >= 18 && hour <= 21) return -0.5; // Falling
  return 0;
}

function getTemperatureImpact(hour) {
  // Simplified temperature curve
  if (hour >= 14 && hour <= 16) return 2;
  if (hour >= 10 && hour <= 13) return 1;
  if (hour >= 17 && hour <= 20) return -1;
  if (hour >= 5 && hour <= 8) return -2;
  return 0;
}

function calculateConfidence(hour) {
  // Confidence decreases with time
  return Math.max(0.5, 0.95 - hour * 0.02);
}

function generatePredictionSummary(trend, predictedTemp, currentTemp) {
  const diff = predictedTemp - currentTemp;

  if (trend === "increasing") {
    return `Temperature expected to rise by ${Math.round(diff)}°C over the next 24 hours. Plan accordingly!`;
  } else if (trend === "decreasing") {
    return `Temperature expected to drop by ${Math.round(Math.abs(diff))}°C over the next 24 hours. Bring a jacket!`;
  } else {
    return `Temperature expected to remain stable around ${Math.round(predictedTemp)}°C over the next 24 hours.`;
  }
}

module.exports = router;
