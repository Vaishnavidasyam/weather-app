import React, { useState, useCallback } from "react";

import { Search, X, MapPin } from "lucide-react";

import "./SearchBar.css";

function SearchBar({ onSearch, onGeolocation, value, onChange, isLoading }) {
  const [isFocused, setIsFocused] = useState(false);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (value.trim()) {
        onSearch(value);
      }
    },
    [value, onSearch],
  );

  /* =========================================================
     GEOLOCATION
  ========================================================= */

  const handleGeolocationClick = useCallback(() => {
    onGeolocation();
  }, [onGeolocation]);

  /* =========================================================
     CLEAR
  ========================================================= */

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className={`search-bar ${isFocused ? "search-bar--focused" : ""}`}>
      {/* =====================================================
          SEARCH FORM
      ===================================================== */}

      <form onSubmit={handleSubmit} className="search-bar__form">
        {/* SEARCH ICON */}

        <Search size={18} className="search-bar__icon" />

        {/* INPUT */}

        <input
          type="text"
          className="search-bar__input"
          placeholder="Search for a city"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
          aria-label="Search city"
        />

        {/* CLEAR BUTTON */}

        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          className="search-bar__submit"
          disabled={isLoading || !value.trim()}
          aria-label="Search"
        >
          {isLoading ? "Loading" : "Search"}
        </button>
      </form>

      {/* =====================================================
          LOCATION BUTTON
      ===================================================== */}

      <button
        type="button"
        className="search-bar__location"
        onClick={handleGeolocationClick}
        disabled={isLoading}
        aria-label="Use current location"
      >
        <MapPin size={18} />
      </button>
    </div>
  );
}

export default SearchBar;
