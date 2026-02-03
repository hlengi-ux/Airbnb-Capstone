import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const EditListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    guests: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/accommodations/${id}`);
      const listing = response.data.data || response.data;
      
      setFormData({
        title: listing.title || '',
        location: listing.location || '',
        description: listing.description || '',
        price: listing.price || '',
        bedrooms: listing.bedrooms || '',
        bathrooms: listing.bathrooms || '',
        guests: listing.guests || ''
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      console.log('Attempting to update listing:', id);
      console.log('Data being sent:', formData);
      
      const response = await API.put(`/accommodations/${id}`, formData);
      console.log('Update successful:', response.data);
      navigate('/admin/listings');
    } catch (error) {
      console.error('Axios Error Details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Request data:', error.config?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Response headers:', error.response?.headers);
      
      setError(`Update failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="loading">Loading listing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="edit-header">
          <h1>Edit Listing</h1>
          <button onClick={() => navigate('/admin/listings')} className="btn btn-secondary">
            ← Back to Listings
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{background: 'white', padding: '2rem', borderRadius: '12px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
            <div>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
              />
            </div>

            <div>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
              />
            </div>

            <div>
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
              />
            </div>

            <div>
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
              />
            </div>

            <div>
              <label>Guests</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
              />
            </div>
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem', height: '100px'}}
            />
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
            <button type="button" onClick={() => navigate('/admin/listings')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;