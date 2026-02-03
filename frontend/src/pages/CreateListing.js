import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateListing.css";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: [""],
    guests: "",
    bedrooms: "",
    bathrooms: "",
    type: "apartment",
    amenities: [""],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData({ ...formData, amenities: newAmenities });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const addAmenityField = () => {
    setFormData({ ...formData, amenities: [...formData.amenities, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/accommodations", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="create-listing">
      <div className="admin-container">
        <div className="admin-header">
          <button
            onClick={() => navigate("/admin/listings")}
            className="back-button"
          >
            View my listings
          </button>
          <h1>Create Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Listing Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Baths</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid two-col">
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="cabin">Cabin</option>
                  <option value="villa">Villa</option>
                  <option value="hotel">Hotel</option>=
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <select
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select location</option>
                  <option value="Cape Town">Cape Town</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Durban">Durban</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <label>Amenities</label>
            {formData.amenities.map((amenity, index) => (
              <div
                key={index}
                className="form-group"
                style={{ marginBottom: "1rem" }}
              >
                <input
                  type="text"
                  value={amenity}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                  placeholder="e.g., WiFi, Pool, Parking"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addAmenityField}
              className="add-image-button"
            >
              Add
            </button>
          </div>

          <div className="form-section">
            <div className="img-btn">
              <label>Images</label>
              <button
                type="button"
                onClick={addImageField}
                className="add-image-button"
              >
                Upload Image
              </button>
            </div>
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="form-group"
                style={{ marginBottom: "1rem" }}
              >
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            ))}
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Create
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/listings")}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
