import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import "./SavedLocations.css";

function SavedLocations({
  savedLocations,
  onSelectLocation,
  onAddLocation,
  onDeleteLocation,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const searchLocation = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/weather/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (location) => {
    await onAddLocation({
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
    });
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  return (
    <div className="saved-locations">
      <div className="saved-locations__header">
        <h3>
          <FaMapMarkerAlt /> Saved Locations
        </h3>
        <button
          className="saved-locations__add-btn"
          onClick={() => setShowSearch(!showSearch)}
        >
          <FaPlus /> Add
        </button>
      </div>

      {showSearch && (
        <div className="saved-locations__search">
          <div className="saved-locations__search-input">
            <FaSearch />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {loading && (
            <div className="saved-locations__loading">Searching...</div>
          )}

          {searchResults.length > 0 && !loading && (
            <div className="saved-locations__results">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="saved-locations__result-item"
                  onClick={() => handleAddLocation(result)}
                >
                  <strong>{result.name}</strong>
                  <span>{result.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="saved-locations__list">
        {savedLocations.length === 0 ? (
          <div className="saved-locations__empty">
            <p>No saved locations yet</p>
            <small>Click "Add" to search and save cities</small>
          </div>
        ) : (
          savedLocations.map((location, index) => (
            <div key={location._id || index} className="saved-locations__item">
              <div
                className="saved-locations__item-info"
                onClick={() => onSelectLocation(location)}
              >
                <FaMapMarkerAlt className="saved-locations__item-icon" />
                <div>
                  <strong>{location.name}</strong>
                  {location.country && <span>{location.country}</span>}
                </div>
              </div>
              <button
                className="saved-locations__item-delete"
                onClick={() => onDeleteLocation(location._id)}
                aria-label="Delete location"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedLocations;
