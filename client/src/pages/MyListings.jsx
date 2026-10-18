import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getMyListings();

      if (result.success) {
        setListings(result.data || []);
      } else {
        setError(result.error || result.message || 'Failed to fetch your listings');
      }
    } catch (err) {
      setError(err.message || 'Error loading listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // Handle Delete with confirmation
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const result = await api.deleteProduct(id);
      if (result.success) {
        setActionSuccess(`"${name}" was deleted successfully.`);
        setListings(prev => prev.filter(item => item._id !== id));
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        alert('Could not delete product: ' + (result.message || result.error || 'Server error'));
      }
    } catch (err) {
      alert('Error deleting listing: ' + err.message);
    }
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">My Listed Products</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Manage your active product listings, update prices, or remove sold items.
            </p>
          </div>

          <Link to="/sell" className="btn btn-primary">
            + List Another Item
          </Link>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="alert alert-success">
            <span>✓</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3.5rem 0', color: 'var(--color-burgundy)' }}>
            <p style={{ fontWeight: '600' }}>⏳ Loading your listings...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">You Have No Active Listings</h3>
            <p className="empty-state-text">
              You haven&rsquo;t listed any items for sale yet. Turn your unused electronics, furniture, books, or sports gear into cash today!
            </p>
            <Link to="/sell" className="btn btn-primary">
              + Post Your First Listing
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="product-grid">
            {listings.map((product) => {
              const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(product.price || 0);

              return (
                <div key={product._id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="product-card-image-wrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-card-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="product-card-condition-tag">
                      <span className="badge badge-condition-good">{product.condition}</span>
                    </div>
                  </div>

                  <div className="product-card-body">
                    <span className="product-card-category">{product.category}</span>
                    <h3 className="product-card-title">{product.name}</h3>

                    <div style={{ margin: '0.5rem 0 1rem' }}>
                      <span className="product-card-price">{formattedPrice}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        📍 {product.location}
                      </span>
                    </div>

                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--color-border-light)',
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'space-between'
                    }}>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1 }}
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit/${product._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product._id, product.name)}
                        style={{ padding: '0.45rem 0.75rem' }}
                        title="Delete product"
                        aria-label="Delete listing"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
