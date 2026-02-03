import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LocationsPage.css';

const LocationsPage = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchListings();
    
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location]);

  const fetchListings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accommodations');
      
      
      const listingsData = response.data.data || response.data || [];
      setListings(Array.isArray(listingsData) ? listingsData : []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = Array.isArray(listings) ? listings.filter(listing => {
    const matchesSearch = !searchTerm || 
      (listing.title && listing.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (listing.location && listing.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  }) : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="locations-page">
        <div className="locations-container">
          <div className="loading">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="locations-page">
      <div className="locations-header">
        <div className="locations-container">
          <h1 className="locations-title">Explore Properties</h1>
          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="locations-content">
        <div className="locations-container">
          <div className="listings-count">
            {filteredListings.length} properties found
            {searchTerm && ` for "${searchTerm}"`}
          </div>
          
          {filteredListings.length === 0 ? (
            <div className="no-listings">
              <p>No properties found{searchTerm && ` for "${searchTerm}"`}</p>
              <p>Try adjusting your search terms or browse all properties</p>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredListings.map((listing) => (
                <Link to={`/property/${listing._id}`} key={listing._id} className="listing-card-link">
                  <div className="listing-card">
                    <div className="listing-image">
                      <img 
                        src={listing.images && listing.images[0] ? listing.images[0] : '/default-property.jpg'} 
                        alt={listing.title || 'Property'}
                        onError={(e) => {
                          e.target.src = '/default-property.jpg';
                        }}
                      />
                      <button className="heart-button">
                        <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor">
                          <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="listing-content">
                      <div className="listing-location">{listing.location || 'Location not specified'}</div>
                      <div className="listing-title">{listing.title || 'Untitled Property'}</div>
                      <div className="listing-price">
                        <span className="price-amount">${listing.price || 0}</span> night
                      </div>
                      <div className="listing-rating">
                        <span className="stars">⭐ 4.8</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;