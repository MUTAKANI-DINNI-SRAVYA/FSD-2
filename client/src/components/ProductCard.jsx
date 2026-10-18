import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  // Fallback placeholder image when image fails or is empty
  const fallbackImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23FBF2F4" width="400" height="300"/><text fill="%237A1B2C" font-family="sans-serif" font-size="20" font-weight="bold" x="50%" y="45%" text-anchor="middle">📦 Pre-Loved Item</text><text fill="%23888888" font-family="sans-serif" font-size="14" x="50%" y="60%" text-anchor="middle">${encodeURIComponent(product.category || 'Product')}</text></svg>`;

  // Condition badge style selector
  const getConditionBadgeClass = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'like new':
        return 'badge-condition-like-new';
      case 'fair':
        return 'badge-condition-fair';
      case 'good':
      default:
        return 'badge-condition-good';
    }
  };

  // Format currency in Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price || 0);

  return (
    <article className="product-card" id={`product-${product._id}`}>
      {/* Product Image with Condition Badge */}
      <div className="product-card-image-wrap">
        <img
          src={imageError || !product.imageUrl ? fallbackImage : product.imageUrl}
          alt={product.name}
          className="product-card-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="product-card-condition-tag">
          <span className={`badge ${getConditionBadgeClass(product.condition)}`}>
            {product.condition}
          </span>
        </div>
      </div>

      {/* Product Body */}
      <div className="product-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-card-category">{product.category}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            📍 {product.location ? product.location.split(',')[0] : 'Local Area'}
          </span>
        </div>

        <h3 className="product-card-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-card-footer">
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Price</span>
            <span className="product-card-price">{formattedPrice}</span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="btn btn-primary btn-sm"
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
