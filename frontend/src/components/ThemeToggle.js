import React from "react";

import { Moon, Sun } from "lucide-react";

import "./ThemeToggle.css";

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  const handleToggle = () => {
    onToggle(isDark ? "light" : "dark");
  };

  return (
    <button
      className={`theme-toggle ${isDark ? "theme-toggle--dark" : ""}`}
      onClick={handleToggle}
      aria-label="Toggle Theme"
    >
      <div className="theme-toggle__thumb">
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </div>
    </button>
  );
}

export default ThemeToggle;
