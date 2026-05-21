import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useWeather(location, units) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pollInterval, setPollInterval] = useState(60000); // 60 seconds

  const fetchWeather = useCallback(async () => {
    if (!location.lat || !location.lon) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/weather", {
        params: {
          lat: location.lat,
          lon: location.lon,
          units,
        },
      });

      setWeather(response.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.response?.data?.error || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, [location, units]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Auto-refresh with polling
  useEffect(() => {
    const interval = setInterval(fetchWeather, pollInterval);
    return () => clearInterval(interval);
  }, [fetchWeather, pollInterval]);

  const refreshWeather = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    refreshWeather,
  };
}

export default useWeather;
