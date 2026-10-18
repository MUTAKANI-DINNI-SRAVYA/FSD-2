import { useState } from 'react';

export default function ContactModal({ isOpen, onClose, product }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(product.sellerContact || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="contact-modal-title">
            Contact Seller
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close contact modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            Get in touch directly with the seller to ask questions, verify details, or arrange safe local inspection:
          </p>

          <div style={{
            backgroundColor: 'var(--color-blush-light)',
            border: '1px solid var(--color-blush)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '700' }}>
                Seller Name
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-black)' }}>
                {product.sellerName || 'Community Member'}
              </p>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '700' }}>
                Contact Information
              </span>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-burgundy)', wordBreak: 'break-all' }}>
                {product.sellerContact || 'Contact info not provided'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '700' }}>
                City / Pickup Location
              </span>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                📍 {product.location || 'Local Area'}
              </p>
            </div>
          </div>

          {/* General Marketplace Safety Tip */}
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            backgroundColor: '#FFF9F0',
            border: '1px solid #FFE8C7',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            💡 <strong>Safe Buying Tip:</strong> Meet in busy, well-lit public places (malls, metro stations, or popular cafes). Thoroughly check the item before handing over payment.
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopy}
            >
              {copied ? '✓ Copied!' : '📋 Copy Contact'}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
