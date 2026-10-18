import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContactModal from '../components/ContactModal';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback placeholder image
  const fallbackImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%23FBF2F4" width="600" height="400"/><text fill="%237A1B2C" font-family="sans-serif" font-size="28" font-weight="bold" x="50%" y="45%" text-anchor="middle">📦 Pre-Loved Item</text><text fill="%23888888" font-family="sans-serif" font-size="16" x="50%" y="60%" text-anchor="middle">Photo Unavailable</text></svg>`;

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const result = await api.getProductById(id);

        if (isMounted) {
          if (result.success && result.data) {
            setProduct(result.data);
          } else {
            setError(result.error || 'Product listing not found');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Error loading product details');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle Delete listing
  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const result = await api.deleteProduct(id);
      if (result.success) {
        alert('Product deleted successfully!');
        navigate('/my-listings');
      } else {
        alert('Failed to delete product: ' + (result.message || result.error || 'Server error'));
      }
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--color-burgundy)', fontSize: '1.2rem', fontWeight: '600' }}>
          ⏳ Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section container">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h2 className="empty-state-title">Listing Not Found</h2>
          <p className="empty-state-text">
            {error || 'The requested product listing may have been sold or removed by the seller.'}
          </p>
          <Link to="/browse" className="btn btn-primary">
            ← Back to All Products
          </Link>
        </div>
      </div>
    );
  }

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price || 0);

  // Dynamic ownership check: seller ID matches logged in user
  const isOwner = user && (
    (product.seller?._id && product.seller._id.toString() === user._id.toString()) ||
    (product.seller && product.seller.toString() === user._id.toString()) ||
    (product.sellerContact && user.email && product.sellerContact.includes(user.email))
  );

  return (
    <div className="section">
      <div className="container">
        {/* Navigation Breadcrumb / Back button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/browse"
            style={{
              color: 'var(--color-burgundy)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.92rem'
            }}
          >
            ← Back to Products Catalog
          </Link>
        </div>

        {/* Product Details Layout */}
        <div className="details-layout">
          {/* Left Column: Product Image */}
          <div className="details-image-container">
            <img
              src={imageError || !product.imageUrl ? fallbackImage : product.imageUrl}
              alt={product.name}
              className="details-image"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            <div className="details-header">
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-category">{product.category}</span>
                <span className="badge badge-condition-good">{product.condition} Condition</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Listed: {new Date(product.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-black)', lineHeight: '1.25' }}>
                {product.name}
              </h1>

              <div className="details-price">{formattedPrice}</div>
            </div>

            {/* Quick Details Box */}
            <div className="details-meta-card">
              <div>
                <span className="meta-item-label">Seller</span>
                <div className="meta-item-value">👤 {product.sellerName || 'Community Seller'}</div>
              </div>

              <div>
                <span className="meta-item-label">City / Location</span>
                <div className="meta-item-value">📍 {product.location || 'Local Area'}</div>
              </div>

              <div>
                <span className="meta-item-label">Item Condition</span>
                <div className="meta-item-value">✨ {product.condition}</div>
              </div>

              <div>
                <span className="meta-item-label">Listing Type</span>
                <div className="meta-item-value">🛡️ Direct Peer Exchange</div>
              </div>
            </div>

            {/* Description */}
            <div className="details-description-box">
              <h2 className="details-description-title">Product Description</h2>
              <p className="details-description-text">
                {product.description || 'No description provided for this listing.'}
              </p>
            </div>

            {/* Call to Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
                onClick={() => setShowContactModal(true)}
              >
                📞 Contact Seller
              </button>

              {/* Show Edit/Delete ONLY if current user owns this listing */}
              {isOwner && (
                <>
                  <Link to={`/edit/${product._id}`} className="btn btn-secondary">
                    ✏️ Edit Listing
                  </Link>
                  <button type="button" className="btn btn-outline" onClick={handleDelete} style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Seller Modal */}
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          product={product}
        />
      </div>
    </div>
  );
}
