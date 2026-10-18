import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, CONDITIONS } from '../services/mockData';

export default function SellItem() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'Good',
    imageUrl: '',
    sellerName: user?.name || '',
    sellerContact: user ? `${user.email}${user.phone ? ' | ' + user.phone : ''}` : '',
    location: user?.city || ''
  });

  // Keep form updated when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        sellerName: prev.sellerName || user.name || '',
        sellerContact: prev.sellerContact || `${user.email}${user.phone ? ' | ' + user.phone : ''}`,
        location: prev.location || user.city || ''
      }));
    }
  }, [user]);

  // UI feedback states
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Client-side Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please specify what you are selling';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a product description';
    }

    if (!formData.price) {
      newErrors.price = 'Please enter a price in ₹';
    } else {
      const numericPrice = parseFloat(formData.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        newErrors.price = 'Price must be a valid positive number';
      }
    }

    if (!formData.category || formData.category === 'All') {
      newErrors.category = 'Please choose a category';
    }

    if (!formData.condition || formData.condition === 'All') {
      newErrors.condition = 'Please select product condition';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'City or location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      };

      const result = await api.createProduct(payload);

      if (result.success) {
        setSuccessMessage('🎉 Product successfully listed on the marketplace!');
        setTimeout(() => {
          navigate('/my-listings');
        }, 1600);
      } else {
        setServerError(result.error || result.message || 'Failed to list product. Please check your inputs.');
      }
    } catch (err) {
      setServerError(err.message || 'Server error while submitting product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        {/* Form Container Card */}
        <div className="form-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
              Create Listing
            </span>
            <h1 className="section-title">Sell an Item</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Turn your unused belongings, gadgets, furniture, and essentials into cash.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="alert alert-success">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Server Error Banner */}
          {serverError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* What are you selling? */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                What are you selling? <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="e.g., Apple iPad Air 64GB, Wooden Study Desk, Philips Air Fryer..."
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            {/* Price in ₹ and Choose a category (Two Column Row) */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Price in ₹ <span className="required">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  placeholder="e.g., 2500"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <div className="form-error">{errors.price}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Choose a category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>
            </div>

            {/* Select product condition and Product image URL (Two Column Row) */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="condition">
                  Select product condition <span className="required">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  className={`form-control ${errors.condition ? 'is-invalid' : ''}`}
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {CONDITIONS.filter(c => c !== 'All').map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
                {errors.condition && <div className="form-error">{errors.condition}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">
                  Product image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <div className="form-helper">Optional: Enter a direct web image link. A clean placeholder is used if left blank.</div>
              </div>
            </div>

            {/* Product description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Product description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Mention key details, age of item, brand, working condition, accessories included, and reason for selling..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            {/* Section Divider: Location Details */}
            <div style={{ margin: '1.75rem 0 1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-black)', marginBottom: '0.25rem' }}>
                Pickup &amp; Location Details
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Your listing will display your registered name ({user?.name || 'Seller'}) and contact details to verified buyers.
              </p>
            </div>

            {/* City or location */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                City or location <span className="required">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                placeholder="e.g., Bangalore, Indiranagar or Mumbai, Bandra West"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
                disabled={submitting}
              >
                {submitting ? '⏳ Listing Your Product...' : '✨ Publish Product Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
