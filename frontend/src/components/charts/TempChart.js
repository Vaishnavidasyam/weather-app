import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

import "./TempChart.css";

/* =========================================================
   REGISTER
========================================================= */

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

function TempChart({ hourly = [], units = "metric" }) {
  if (!hourly.length) return null;

  /* =========================================================
     LABELS
  ========================================================= */

  const labels = hourly.map((hour) => {
    const date = new Date(hour.time);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  });

  /* =========================================================
     DATA
  ========================================================= */

  const temps = hourly.map((hour) => Math.round(hour.temp));

  const feelsLike = hourly.map((hour) => Math.round(hour.feels_like));

  const unitSymbol = units === "metric" ? "°C" : "°F";

  /* =========================================================
     CHART DATA
  ========================================================= */

  const data = {
    labels,

    datasets: [
      {
        label: "Temperature",

        data: temps,

        borderColor: "#7c8cff",

        backgroundColor: "rgba(124,140,255,0.10)",

        fill: true,

        tension: 0.42,

        borderWidth: 2,

        pointRadius: 0,

        pointHoverRadius: 5,

        pointBackgroundColor: "#7c8cff",
      },

      {
        label: "Feels Like",

        data: feelsLike,

        borderColor: "rgba(203,213,225,0.7)",

        backgroundColor: "transparent",

        fill: false,

        tension: 0.42,

        borderWidth: 1.5,

        borderDash: [6, 6],

        pointRadius: 0,

        pointHoverRadius: 4,

        pointBackgroundColor: "#cbd5e1",
      },
    ],
  };

  /* =========================================================
     OPTIONS
  ========================================================= */

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    plugins: {
      legend: {
        position: "top",

        align: "end",

        labels: {
          color: "#cbd5e1",

          usePointStyle: true,

          pointStyle: "circle",

          boxWidth: 8,

          boxHeight: 8,

          padding: 20,

          font: {
            size: 12,
            weight: "600",
          },
        },
      },

      tooltip: {
        backgroundColor: "#0f172a",

        borderColor: "rgba(255,255,255,0.08)",

        borderWidth: 1,

        padding: 12,

        titleColor: "#f8fafc",

        bodyColor: "#cbd5e1",

        displayColors: false,

        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y}${unitSymbol}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          color: "rgba(255,255,255,0.04)",

          drawBorder: false,
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 11,
          },
        },
      },

      y: {
        grid: {
          color: "rgba(255,255,255,0.04)",

          drawBorder: false,
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 11,
          },

          callback: (value) => `${value}${unitSymbol}`,
        },
      },
    },
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="temp-chart">
      {/* HEADER */}

      <div className="temp-chart__header">
        <div>
          <h3>Temperature Trend</h3>

          <span>24-hour forecast</span>
        </div>
      </div>

      {/* CHART */}

      <div className="temp-chart__container">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

export default TempChart;
