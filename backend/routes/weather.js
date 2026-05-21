const express = require("express");
const axios = require("axios");
const axiosRetry = require("axios-retry");
const auth = require("../middleware/auth");
const Location = require("../models/Location");
const router = express.Router();

// Setup axios retry
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Cache (in-memory for now)
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

// Get weather (public)
router.get("/current", async (req, res) => {
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

    // Get air quality
    let airQuality = null;
    try {
      const aqUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const aqResponse = await axios.get(aqUrl, { timeout: 5000 });
      airQuality = parseAirQuality(aqResponse.data);
    } catch (error) {
      console.log("Air quality not available");
    }

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
      airQuality,
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

// Search locations
router.get("/search", async (req, res) => {
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

// Save location (protected)
router.post("/locations", auth, async (req, res) => {
  try {
    const { name, lat, lon, country } = req.body;

    const location = new Location({
      user: req.user._id,
      name,
      lat,
      lon,
      country,
    });

    await location.save();
    req.user.savedLocations.push(location._id);
    await req.user.save();

    res.status(201).json({ message: "Location saved", location });
  } catch (error) {
    res.status(500).json({ error: "Failed to save location" });
  }
});

// Get saved locations (protected)
router.get("/locations", auth, async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user._id });
    res.json({ locations });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Delete location (protected)
router.delete("/locations/:id", auth, async (req, res) => {
  try {
    await Location.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    req.user.savedLocations = req.user.savedLocations.filter(
      (id) => id.toString() !== req.params.id,
    );
    await req.user.save();

    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete location" });
  }
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

function parseAirQuality(data) {
  if (!data || !data.list || !data.list[0]) return null;
  const aq = data.list[0].main.aqi;
  return {
    aqi: aq,
    level:
      ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aq - 1] || "Unknown",
    timestamp: data.list[0].dt * 1000,
  };
}

function generateAIInsights(weather, units) {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const condition = weather.weather[0].main.toLowerCase();
  const feelsLike = weather.main.feels_like;

  const unitSymbol = units === "metric" ? "°C" : "°F";

  // Temperature assessment
  let tempAssessment = "";
  let clothingRecommendation = "";
  let activityRecommendation = "";

  if (units === "metric") {
    if (temp < 10) {
      tempAssessment = "It's quite cold today";
      clothingRecommendation =
        "Wear warm layers, coat, scarf, and gloves. Hot beverages will be your friend!";
      activityRecommendation =
        "Indoor activities recommended. If going out, limit exposure time.";
    } else if (temp < 20) {
      tempAssessment = "The temperature is pleasant and cool";
      clothingRecommendation =
        "Light jacket or sweater should be comfortable. Dress in layers.";
      activityRecommendation =
        "Great day for outdoor activities like walking, cycling, or park visits.";
    } else if (temp < 30) {
      tempAssessment = "It's warm and comfortable";
      clothingRecommendation =
        "Light clothing, t-shirts, and breathable fabrics are perfect.";
      activityRecommendation =
        "Perfect weather for outdoor activities. Morning and evening are ideal.";
    } else {
      tempAssessment = "It's quite hot today";
      clothingRecommendation =
        "Light, loose-fitting clothes. Wear a hat and use sunscreen.";
      activityRecommendation =
        "Avoid outdoor activities during peak heat (12-4 PM). Stay hydrated!";
    }
  } else {
    if (temp < 50) {
      tempAssessment = "It's quite cold today";
      clothingRecommendation = "Wear warm layers, coat, scarf, and gloves.";
      activityRecommendation = "Indoor activities recommended.";
    } else if (temp < 68) {
      tempAssessment = "The temperature is pleasant and cool";
      clothingRecommendation = "Light jacket or sweater should be comfortable.";
      activityRecommendation = "Great day for outdoor activities.";
    } else if (temp < 86) {
      tempAssessment = "It's warm and comfortable";
      clothingRecommendation =
        "Light clothing and breathable fabrics are perfect.";
      activityRecommendation = "Perfect weather for outdoor activities.";
    } else {
      tempAssessment = "It's quite hot today";
      clothingRecommendation =
        "Light, loose-fitting clothes. Wear a hat and sunscreen.";
      activityRecommendation =
        "Avoid outdoor activities during peak heat. Stay hydrated!";
    }
  }

  // Weather condition-specific advice
  let conditionAdvice = "";
  if (condition.includes("rain") || condition.includes("drizzle")) {
    conditionAdvice =
      "Don't forget your umbrella or raincoat. Roads may be slippery.";
  } else if (condition.includes("cloud")) {
    conditionAdvice =
      "Cloudy conditions provide natural shade, but UV rays can still be strong.";
  } else if (condition.includes("clear") || condition.includes("sun")) {
    conditionAdvice =
      "Beautiful sunny day! Don't forget sunscreen if you'll be outside.";
  } else if (condition.includes("thunder")) {
    conditionAdvice =
      "Thunderstorms expected. Stay indoors during heavy storms and avoid open areas.";
  } else if (condition.includes("snow")) {
    conditionAdvice =
      "防滑 shoes recommended. Drive carefully if roads are icy.";
  }

  // Humidity assessment
  let humidityAdvice = "";
  if (humidity > 70) {
    humidityAdvice =
      "High humidity makes it feel warmer. Stay hydrated and seek air conditioning.";
  } else if (humidity < 30) {
    humidityAdvice =
      "Low humidity can cause dry skin. Use moisturizer and drink plenty of water.";
  }

  //Feels-like comparison
  let feelsLikeAdvice = "";
  const diff = feelsLike - temp;
  if (Math.abs(diff) > 3) {
    if (diff > 0) {
      feelsLikeAdvice = `It feels ${Math.round(diff)}°${unitSymbol} warmer than actual temperature due to humidity.`;
    } else {
      feelsLikeAdvice = `It feels ${Math.round(Math.abs(diff))}°${unitSymbol} cooler than actual temperature due to wind.`;
    }
  }

  const summary = `${tempAssessment} (${Math.round(temp)}${unitSymbol}, feels like ${Math.round(feelsLike)}${unitSymbol}). ${conditionAdvice} ${humidityAdvice} ${feelsLikeAdvice}`;

  return {
    summary: summary.trim(),
    temperature: {
      assessment: tempAssessment,
      feelsLike: feelsLikeAdvice,
    },
    clothing: {
      recommendation: clothingRecommendation,
      items: getClothingItems(temp, condition, units),
    },
    activities: {
      recommendation: activityRecommendation,
      indoor: ["Reading", "Cooking", "Movies", "Gaming", "Fitness"],
      outdoor: [
        "Walking",
        "Cycling",
        "Photography",
        "Park visit",
        "Outdoor dining",
      ],
    },
    health: {
      hydration:
        humidity > 70 ? "Stay cool and hydrated" : "Drink plenty of water",
      sunProtection: condition.includes("clear")
        ? "Use SPF 30+ sunscreen"
        : "Sun protection still recommended",
    },
  };
}

function getClothingItems(temp, condition, units) {
  const items = [];

  if (units === "metric") {
    if (temp < 15) items.push("Coat", "Sweater", "Long sleeves");
    else if (temp < 25) items.push("Light jacket", "Long sleeves", "Jeans");
    else items.push("T-shirt", "Shorts", "Light clothing");
  } else {
    if (temp < 59) items.push("Coat", "Sweater", "Long sleeves");
    else if (temp < 77) items.push("Light jacket", "Long sleeves", "Jeans");
    else items.push("T-shirt", "Shorts", "Light clothing");
  }

  if (condition.includes("rain"))
    items.push("Umbrella", "Raincoat", "Waterproof shoes");
  if (condition.includes("clear") || condition.includes("sun"))
    items.push("Sunscreen", "Sunglasses", "Hat");

  return items;
}

module.exports = router;
