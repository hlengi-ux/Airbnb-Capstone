import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout, getCurrentUser } from "../api/auth";
import "./Header.css";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("");

  const user = getCurrentUser();
  const isLoggedIn = !!user;

  const southAfricanCities = [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "East London",
    "Nelspruit",
    "Polokwane",
    "Kimberley",
    "Pietermaritzburg",
    "George",
  ];

  const handleLogout = () => {
    logout();
  };

  const handleLocationSelect = (city) => {
    setSelectedLocation(city);
    setShowLocationDropdown(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Add dates";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <svg
            viewBox="0 0 32 32"
            className="airbnb-logo"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M16 1c2.008 0 3.463 1.155 4.359 3.464l7.466 18.25c.897 2.308.672 4.177-.673 5.606-1.345 1.43-3.058 2.144-5.14 2.144h-11.67c-2.082 0-3.795-.714-5.14-2.144-1.345-1.429-1.57-3.298-.673-5.606l7.466-18.25c.896-2.309 2.351-3.464 4.359-3.464zm0 2c-1.105 0-1.999.594-2.681 1.783l-7.466 18.25c-.533 1.38-.403 2.405.389 3.077.793.672 1.936 1.008 3.426 1.008h11.67c1.49 0 2.633-.336 3.426-1.008.792-.672.922-1.697.389-3.077l-7.466-18.25c-.682-1.189-1.576-1.783-2.681-1.783zm0 5c1.934 0 3.5 1.566 3.5 3.5 0 1.934-1.566 3.5-3.5 3.5s-3.5-1.566-3.5-3.5c0-1.934 1.566-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z" />
          </svg>
          <span className="logo-text">airbnb</span>
        </Link>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <div
            className="search-item"
            onClick={() => {
              setShowLocationDropdown(!showLocationDropdown);
              setShowCheckInCalendar(false);
              setShowCheckOutCalendar(false);
            }}
          >
            <div className="search-label">Location</div>
            <div className="search-value">
              {selectedLocation || "Where are you going"}
            </div>

            {showLocationDropdown && (
              <div className="location-dropdown">
                {southAfricanCities.map((city) => (
                  <div
                    key={city}
                    className="location-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLocationSelect(city);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="#717171"
                      />
                    </svg>
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="search-divider"></div>
          <div
            className="search-item"
            onClick={() => {
              setShowCheckInCalendar(!showCheckInCalendar);
              setShowLocationDropdown(false);
              setShowCheckOutCalendar(false);
            }}
          >
            <div className="search-label">Check in</div>
            <div className="search-value">{formatDate(checkInDate)}</div>

            {showCheckInCalendar && (
              <div className="calendar-dropdown">
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                    setShowCheckInCalendar(false);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          <div className="search-divider"></div>
          <div
            className="search-item"
            onClick={() => {
              setShowCheckOutCalendar(!showCheckOutCalendar);
              setShowLocationDropdown(false);
              setShowCheckInCalendar(false);
            }}
          >
            <div className="search-label">Check out</div>
            <div className="search-value">{formatDate(checkOutDate)}</div>

            {showCheckOutCalendar && (
              <div className="calendar-dropdown">
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => {
                    setCheckOutDate(e.target.value);
                    setShowCheckOutCalendar(false);
                  }}
                  min={checkInDate || new Date().toISOString().split("T")[0]}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          <div className="search-divider"></div>
          <div className="search-item search-item-guests">
            <div className="search-guests-content">
              <div className="search-label">Guests</div>
              <input
                type="number"
                className="guests-input"
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="search-icon">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="white">
                <path d="M13 24c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11zm0-2a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm8-5.414l7.707 7.707 1.414-1.414L22.414 15.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="user-nav">
            <Link to="/admin/listings" className="host-link">
              Manage Listings
            </Link>
            <div className="dropdown-container">
              <button
                className="user-menu-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <svg
                  viewBox="0 0 32 32"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M16 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0 10.5c3.5 0 6.5 1.5 6.5 2.5v1.5h-13v-1.5c0-1 3-2.5 6.5-2.5zm0 2c-2.5 0-4.5.5-4.5 1.5v.5h9v-.5c0-1-2-1.5-4.5-1.5z" />
                </svg>
                <svg
                  viewBox="0 0 32 32"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M16 20l-8-8 2-2 6 6 6-6 2 2z" />
                </svg>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Hello, {user.username}!</div>
                  <Link
                    to="/admin/listings"
                    className="dropdown-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    Manage Listings
                  </Link>
                  <button
                    className="dropdown-link logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
