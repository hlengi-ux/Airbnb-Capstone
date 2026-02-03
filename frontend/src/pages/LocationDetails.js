import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LocationDetails.css';

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/accommodations/${id}`);
      
      const propertyData = response.data.data || response.data;
      
      if (!propertyData) {
        throw new Error('No property data received from API');
      }
      
      let updatedProperty = propertyData;
      if (propertyData._id === '691293b13de31d4e8fea6b7a') {
        updatedProperty = {
          ...propertyData,
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/599569921.jpg?k=63db9d0d77d71825956c9272840841017fc9e7513174c9e95d9917410c03fef4&o=',
            ...propertyData.images
          ]
        };
      }
      
      setProperty(updatedProperty);
      setError(null);
    } catch (error) {
      setError(error.message);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !property) return property?.price || 0;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return nights * property.price;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    return (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      const bookingData = {
        accommodation: id,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        totalPrice: calculateTotal()
      };
      
      await axios.post('http://localhost:5000/api/reservations', bookingData);
      alert('Booking confirmed!');
      navigate('/');
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const Calendar = ({ selectedDate, onDateSelect, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const today = new Date();
    const days = generateCalendarDays(currentYear, currentMonth);
    
    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };
    
    const prevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };
    
    const isDateDisabled = (date) => {
      if (!date) return true;
      return date < minDate;
    };
    
    const isDateSelected = (date) => {
      if (!date || !selectedDate) return false;
      return date.toDateString() === new Date(selectedDate).toDateString();
    };

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth} className="calendar-nav-button">
            ‹
          </button>
          <span className="calendar-month">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button onClick={nextMonth} className="calendar-nav-button">
            ›
          </button>
        </div>
        
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>
          
          <div className="calendar-days">
            {days.map((date, index) => (
              <button
                key={index}
                className={`calendar-day ${
                  isDateSelected(date) ? 'selected' : ''
                } ${
                  isDateDisabled(date) ? 'disabled' : ''
                }`}
                onClick={() => !isDateDisabled(date) && onDateSelect(date)}
                disabled={isDateDisabled(date)}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="property-detail">
        <div className="loading">
          <h3>Loading property details...</h3>
          <p>Property ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail">
        <div className="error-message">
          <h3>Error loading property</h3>
          <p>{error}</p>
          <p>Property ID: {id}</p>
          <button onClick={fetchProperty} className="retry-button">
            Try Again
          </button>
          <button onClick={() => navigate('/locations')} className="secondary-button">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <div className="error-message">
          <h3>Property not found</h3>
          <p>No property found with ID: {id}</p>
          <button onClick={() => navigate('/locations')} className="retry-button">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail">
      <div className="property-images">
        <div className="main-image-grid">
          <div className="primary-image">
            <img 
              src={property.images?.[activeImageIndex] || '/default-property.jpg'} 
              alt={property.title} 
              onError={(e) => {
                e.target.src = '/default-property.jpg';
              }}
            />
            {property.images && property.images.length > 1 && (
              <button 
                className="show-all-images-btn"
                onClick={() => setShowAllImages(true)}
              >
                <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor">
                  <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2zm0 2c6.62 0 12 5.38 12 12s-5.38 12-12 12S4 22.62 4 16 9.38 4 16 4zm-2 5v6H8v2h6v6h2v-6h6v-2h-6V9h-2z"/>
                </svg>
                Show all {property.images.length} photos
              </button>
            )}
          </div>
          
          {property.images && property.images.length > 1 && (
            <div className="secondary-images">
              {property.images.slice(0, 4).map((image, index) => (
                index > 0 && (
                  <div 
                    key={index} 
                    className="secondary-image"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/default-property.jpg';
                      }}
                    />
                    {index === 3 && property.images.length > 5 && (
                      <div className="image-overlay">
                        +{property.images.length - 4} more
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {property.images && property.images.length > 1 && (
          <div className="image-thumbnails">
            {property.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} ${index + 1}`}
                className={index === activeImageIndex ? 'active' : ''}
                onClick={() => setActiveImageIndex(index)}
                onError={(e) => {
                  e.target.src = '/default-property.jpg';
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showAllImages && (
        <div className="image-modal">
          <div className="modal-header">
            <button 
              className="close-modal"
              onClick={() => setShowAllImages(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="modal-main-image">
              <img 
                src={property.images?.[activeImageIndex] || '/default-property.jpg'} 
                alt={property.title} 
              />
            </div>
            <div className="modal-thumbnails">
              {property.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className={index === activeImageIndex ? 'active' : ''}
                  onClick={() => setActiveImageIndex(index)}
                  onError={(e) => {
                    e.target.src = '/default-property.jpg';
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="property-layout">
        <div className="property-info">
          <div className="property-header">
            <h1>{property.title}</h1>
            <div className="property-subtitle">
              <span>{property.guests || 1} guest{property.guests !== 1 ? 's' : ''}</span>
              <span> • </span>
              <span>{property.bedrooms || 1} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
              <span> • </span>
              <span>{property.bedrooms || 1} bed{property.bedrooms !== 1 ? 's' : ''}</span>
              <span> • </span>
              <span>{property.bathrooms || 1} private bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="feature-section">
            <div className="feature-icon">⭐</div>
            <div className="feature-content">
              <h4>Guest favorite</h4>
              <p>One of the most loved homes on Airbnb, according to guests</p>
            </div>
          </div>

          <div className="rating-section">
            <div className="rating-item">
              <div className="rating-score">
                <span className="score">4.95</span>
                <div className="stars">★★★★★</div>
              </div>
              <div className="reviews">
                <span className="review-count">43</span>
                <span className="review-text">Reviews</span>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="quality-badge">
            <div className="badge-icon">🏆</div>
            <div className="badge-content">
              <h4>Top 10% of homes</h4>
              <p>This home is highly ranked based on ratings, reviews, and reliability.</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="amenities">
            <h3>What this place offers</h3>
            <div className="amenities-grid">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-tag">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-card">
          <div className="price-section">
            <div className="total-price">
              <span className="price-amount">R{calculateTotal().toLocaleString()}</span>
              <span className="price-period"> ZAR for {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="booking-dates-grid">
            <div className="date-column">
              <label>CHECK IN</label>
              <div 
                className="date-display-input"
                onClick={() => {
                  setShowCheckInCalendar(true);
                  setShowCheckOutCalendar(false);
                }}
              >
                {checkIn ? new Date(checkIn).toLocaleDateString() : 'Add date'}
              </div>
            </div>
            <div className="date-column">
              <label>CHECKOUT</label>
              <div 
                className="date-display-input"
                onClick={() => {
                  setShowCheckOutCalendar(true);
                  setShowCheckInCalendar(false);
                }}
              >
                {checkOut ? new Date(checkOut).toLocaleDateString() : 'Add date'}
              </div>
            </div>
          </div>

          {showCheckInCalendar && (
            <div className="calendar-popup">
              <Calendar
                selectedDate={checkIn}
                onDateSelect={(date) => {
                  setCheckIn(date.toISOString().split('T')[0]);
                  setShowCheckInCalendar(false);
                }}
                minDate={new Date()}
              />
            </div>
          )}

          {showCheckOutCalendar && (
            <div className="calendar-popup">
              <Calendar
                selectedDate={checkOut}
                onDateSelect={(date) => {
                  setCheckOut(date.toISOString().split('T')[0]);
                  setShowCheckOutCalendar(false);
                }}
                minDate={checkIn ? new Date(checkIn) : new Date()}
              />
            </div>
          )}
          
          <div className="guests-section">
            <label>GUESTS</label>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <button 
            className="reserve-button"
            onClick={handleBooking}
            disabled={!checkIn || !checkOut}
          >
            Reserve
          </button>
          
          <div className="no-charge-notice">
            You won't be charged yet
          </div>

          <div className="price-breakdown">
            <div className="price-line">
              <span>R{property.price.toLocaleString()} x {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
              <span>R{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="price-line total">
              <span>Total</span>
              <span>R{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;