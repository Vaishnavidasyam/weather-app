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

import "./HumidityChart.css";

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

function HumidityChart({ hourly = [] }) {
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

  const humidity = hourly.map((hour) => hour.humidity);

  const data = {
    labels,

    datasets: [
      {
        label: "Humidity",

        data: humidity,

        borderColor: "#38bdf8",

        backgroundColor: "rgba(56,189,248,0.10)",

        fill: true,

        tension: 0.4,

        borderWidth: 2,

        pointRadius: 0,

        pointHoverRadius: 5,

        pointBackgroundColor: "#38bdf8",
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
          label: (context) => `Humidity: ${context.parsed.y}%`,
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
        min: 0,
        max: 100,

        grid: {
          color: "rgba(255,255,255,0.04)",

          drawBorder: false,
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 11,
          },

          callback: (value) => `${value}%`,
        },
      },
    },
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="humidity-chart">
      {/* HEADER */}

      <div className="humidity-chart__header">
        <div>
          <h3>Humidity Trend</h3>

          <span>24-hour forecast</span>
        </div>
      </div>

      {/* CHART */}

      <div className="humidity-chart__container">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

export default HumidityChart;
