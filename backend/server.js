require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple cache
const cache = new Map();
const CACHE_TTL = 60000;

function getFromCache(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Weather endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon, units = "metric" } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const cacheKey = `${lat}-${lon}-${units}`;
    const cached = getFromCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Fetch current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const currentResponse = await axios.get(currentUrl, { timeout: 10000 });
    const currentData = currentResponse.data;

    // Fetch forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    let forecastData = null;
    try {
      const forecastResponse = await axios.get(forecastUrl, { timeout: 10000 });
      forecastData = forecastResponse.data;
    } catch (error) {
      console.log("Forecast not available");
    }

    // Process hourly data
    let hourly = [];
    if (forecastData && forecastData.list) {
      hourly = forecastData.list.slice(0, 8).map((item) => ({
        time: item.dt * 1000,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        weather: item.weather[0],
        pop: item.pop || 0,
      }));
    }

    // Process daily data
    const daily = processDailyData(hourly, forecastData);

    // Generate AI insights
    const aiInsights = generateAIInsights(currentData, units);

    const result = {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        wind_direction: currentData.wind.deg,
        weather: currentData.weather[0],
        pressure: currentData.main.pressure,
        visibility: currentData.visibility,
        timestamp: currentData.dt * 1000,
      },
      hourly,
      daily,
      aiInsights,
      units,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("Weather error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch weather", details: error.message });
  }
});

// Search endpoint
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;

    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "2.0.0-advanced",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Advanced Weather API v2.0",
    endpoints: {
      weather: "/api/weather?lat=&lon=&units=",
      search: "/api/search?q=",
      health: "/api/health",
    },
  });
});

// Helper functions
function processDailyData(hourly, forecastData) {
  if (!forecastData || !forecastData.list) {
    return Array.from({ length: 7 }, (_, i) => ({
      date: Date.now() + i * 86400000,
      temp_min: 25,
      temp_max: 30,
      avg_temp: 27,
      humidity: 65,
      weather: { main: "Clear", description: "clear sky", icon: "01d" },
      pop: 0.1,
    }));
  }

  const dailyMap = new Map();
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date: item.dt * 1000,
        temps: [],
        weather: item.weather[0],
        humidity: [],
        pop: item.pop || 0,
      });
    }
    const day = dailyMap.get(date);
    day.temps.push(item.main.temp);
    day.humidity.push(item.main.humidity);
  });

  return Array.from(dailyMap.values())
    .map((day) => ({
      date: day.date,
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
      avg_temp: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
      humidity: day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length,
      weather: day.weather,
      pop: day.pop,
    }))
    .slice(0, 7);
}

function generateAIInsights(weather, units) {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const condition = weather.weather[0].main.toLowerCase();
  const feelsLike = weather.main.feels_like;
  const unitSymbol = units === "metric" ? "°C" : "°F";

  let tempAssessment = "";
  let clothingRec = "";

  if (units === "metric") {
    if (temp < 15) {
      tempAssessment = "It's quite cold today";
      clothingRec = "Wear warm layers, coat, scarf, and gloves.";
    } else if (temp < 25) {
      tempAssessment = "The temperature is pleasant and cool";
      clothingRec = "Light jacket or sweater should be comfortable.";
    } else if (temp < 32) {
      tempAssessment = "It's warm and comfortable";
      clothingRec = "Light clothing, t-shirts, and breathable fabrics.";
    } else {
      tempAssessment = "It's quite hot today";
      clothingRec = "Light, loose-fitting clothes. Wear a hat and sunscreen.";
    }
  }

  let conditionAdvice = "";
  if (condition.includes("rain")) {
    conditionAdvice = "Don't forget your umbrella or raincoat.";
  } else if (condition.includes("clear") || condition.includes("sun")) {
    conditionAdvice = "Beautiful sunny day! Don't forget sunscreen.";
  } else if (condition.includes("cloud")) {
    conditionAdvice = "Cloudy conditions provide natural shade.";
  }

  const summary = `${tempAssessment} (${Math.round(temp)}${unitSymbol}, feels like ${Math.round(feelsLike)}${unitSymbol}). ${conditionAdvice}`;

  return {
    summary: summary.trim(),
    temperature: {
      assessment: tempAssessment,
      feelsLike: `Feels like ${Math.round(feelsLike)}${unitSymbol}`,
    },
    clothing: {
      recommendation: clothingRec,
      items: getClothingItems(temp, condition, units),
    },
    activities: {
      recommendation:
        temp > 32
          ? "Avoid outdoor activities during peak heat"
          : "Great day for outdoor activities!",
      indoor: ["Reading", "Cooking", "Movies", "Gaming"],
      outdoor: ["Walking", "Cycling", "Photography", "Park visit"],
    },
  };
}

function getClothingItems(temp, condition, units) {
  const items = [];
  if (units === "metric") {
    if (temp < 15) items.push("Coat", "Sweater", "Long sleeves");
    else if (temp < 25) items.push("Light jacket", "Long sleeves", "Jeans");
    else items.push("T-shirt", "Shorts", "Light clothing");
  }
  if (condition.includes("rain")) items.push("Umbrella", "Raincoat");
  if (condition.includes("clear")) items.push("Sunscreen", "Sunglasses", "Hat");
  return items;
}

// Start server
app.listen(PORT, () => {
  console.log(`🌤️ Advanced Weather Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(
    `🔑 API Key: ${process.env.OPENWEATHER_API_KEY ? "Loaded ✓" : "Missing ✗"}`,
  );
});
