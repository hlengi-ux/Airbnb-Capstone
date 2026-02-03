import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewListings.css";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
    fetchBookings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/accommodations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setListings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/reservations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/accommodations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchListings();
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBookings();
      } catch (error) {
        console.error("Error canceling booking:", error);
      }
    }
  };

  const calculateTotalRevenue = () => {
    return bookings.reduce(
      (total, booking) => total + (booking.totalPrice || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="view-listings">
        <div className="admin-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-listings">
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
          </div>
          <Link to="/admin/create" className="create-button">
            + Add New Listing
          </Link>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === "listings" ? "tab-active" : ""}
            onClick={() => setActiveTab("listings")}
          >
            Listings ({listings.length})
          </button>
          <button
            className={activeTab === "bookings" ? "tab-active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            My Reservations ({bookings.length})
          </button>
        </div>

        {activeTab === "listings" && (
          <div className="listings-section">
            <div className="listings-grid">
              {listings.length === 0 ? (
                <div className="no-listings">
                  <p>
                    No listings found.{" "}
                    <Link to="/admin/create">Create your first listing</Link>
                  </p>
                </div>
              ) : (
                listings.map((listing) => (
                  <div key={listing._id} className="listing-card">
                    <div className="listing-image">
                      <img
                        src={
                          listing.images && listing.images[0]
                            ? listing.images[0]
                            : "/default-property.jpg"
                        }
                        alt={listing.title || "Property"}
                      />
                    </div>
                    <div className="listing-content">
                      <h3 className="listing-title">
                        {listing.title || "Untitled Property"}
                      </h3>
                      <p className="listing-location">
                        {listing.location || "Location not specified"}
                      </p>
                      <p className="listing-price">
                        ${listing.price || 0} / night
                      </p>
                      <div className="listing-actions">
                        <Link
                          to={`/admin/edit/${listing._id}`}
                          className="edit-button"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-section">
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booked By</th>
                    <th>Property</th>
                    <th>Checkin</th>
                    <th>Checkout</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-bookings-row">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.accommodation?.title || "Property"}</td>
                        <td>{booking.user || "Guest"}</td>
                        <td>
                          {booking.checkIn
                            ? new Date(booking.checkIn).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          {booking.checkOut
                            ? new Date(booking.checkOut).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{booking.guests || 1}</td>
                        <td>${booking.totalPrice || 0}</td>
                        <td>
                          <span
                            className={`status status-${
                              booking.status || "confirmed"
                            }`}
                          >
                            {booking.status || "confirmed"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewListings;
