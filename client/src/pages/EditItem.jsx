import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CATEGORIES, CONDITIONS } from '../services/mockData';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'Good',
    imageUrl: '',
    sellerName: '',
    sellerContact: '',
    location: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const result = await api.getProductById(id);
        if (isMounted) {
          if (result.success && result.data) {
            const p = result.data;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              price: p.price ? String(p.price) : '',
              category: p.category || 'Electronics',
              condition: p.condition || 'Good',
              imageUrl: p.imageUrl || '',
              sellerName: p.sellerName || '',
              sellerContact: p.sellerContact || '',
              location: p.location || ''
            });
          } else {
            setServerError('Product not found for editing.');
          }
        }
      } catch (err) {
        if (isMounted) setServerError(err.message || 'Error loading product.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const p = parseFloat(formData.price);
      if (isNaN(p) || p <= 0) newErrors.price = 'Price must be a positive number';
    }
    if (!formData.location.trim()) newErrors.location = 'City or location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      const result = await api.updateProduct(id, payload);

      if (result.success) {
        setSuccessMessage('✓ Listing updated successfully!');
        setTimeout(() => {
          navigate(`/products/${id}`);
        }, 1500);
      } else {
        setServerError(result.error || 'Failed to update product');
      }
    } catch (err) {
      setServerError(err.message || 'Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ color: 'var(--color-burgundy)', fontWeight: '600' }}>⏳ Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ maxWidth: '760px', margin: '0 auto 1.5rem' }}>
          <Link to="/my-listings" style={{ color: 'var(--color-burgundy)', fontWeight: '600' }}>
            ← Back to My Listings
          </Link>
        </div>

        <div className="form-card">
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="badge badge-category">Update Listing</span>
            <h1 className="section-title">Edit Product Listing</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Modify asking price, description, or city location.
            </p>
          </div>

          {successMessage && (
            <div className="alert alert-success">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {serverError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">What are you selling?</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="price">Price in ₹</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <div className="form-error">{errors.price}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Choose a category</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="condition">Select product condition</label>
                <select
                  id="condition"
                  name="condition"
                  className="form-control"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {CONDITIONS.filter(c => c !== 'All').map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">Product image URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Product description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">City or location</label>
              <input
                id="location"
                name="location"
                type="text"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
                disabled={submitting}
              >
                {submitting ? 'Saving Changes...' : 'Save Updates'}
              </button>
              <Link to="/my-listings" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
