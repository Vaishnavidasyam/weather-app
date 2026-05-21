import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./WindChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function WindChart({ hourly }) {
  const labels = hourly.map((h) => {
    const date = new Date(h.time);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true });
  });

  const windSpeed = hourly.map((h) => h.wind_speed);

  const data = {
    labels,
    datasets: [
      {
        label: "Wind Speed (m/s)",
        data: windSpeed,
        borderColor: "rgb(135, 206, 250)",
        backgroundColor: "rgba(135, 206, 250, 0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: { size: 12, weight: "600" },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: "Wind Speed Forecast",
        color: "white",
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `Wind: ${context.parsed.y.toFixed(1)} m/s`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="wind-chart">
      <div className="wind-chart__container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default WindChart;
