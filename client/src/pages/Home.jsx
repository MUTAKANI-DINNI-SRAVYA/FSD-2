import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { api } from '../services/api';
import { CATEGORIES } from '../services/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for 10 general categories
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electronics': return '📱';
      case 'Furniture': return '🛋️';
      case 'Fashion': return '👗';
      case 'Home and Kitchen': return '🍳';
      case 'Books and Education': return '📚';
      case 'Sports and Fitness': return '🚴';
      case 'Vehicles and Accessories': return '🛵';
      case 'Toys and Baby Products': return '🧸';
      case 'Tools and Equipment': return '🔧';
      default: return '📦';
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchRecentProducts() {
      try {
        setLoading(true);
        const result = await api.getProducts({ sort: 'newest' });
        if (isMounted) {
          if (result.success) {
            setRecentProducts(result.data.slice(0, 8));
          } else {
            setError(result.error || 'Failed to load products');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'An error occurred');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRecentProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeroSearch = (term) => {
    if (term) {
      navigate(`/browse?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <p style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-burgundy)', marginBottom: '0.6rem' }}>
            BUY • SELL • REUSE
          </p>

          <div className="hero-pill">
            <span>🌿</span>
            <span>VYRA — Value Finds a New Life</span>
          </div>

          <h1 className="hero-title">
            Give Pre-Loved Things a <span>New Life.</span>
          </h1>

          <p className="hero-description">
            Discover great second-hand finds, save money, and give useful items a second chance with VYRA. Buy and sell everyday essentials, electronics, furniture, fashion, and more.
          </p>

          {/* Prominent Search Bar in Hero */}
          <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            <SearchBar
              onSearch={handleHeroSearch}
              placeholder="What are you looking for today? (e.g., iPhone, sofa, cycle, drill)..."
            />
          </div>

          <div className="hero-cta">
            <Link to="/browse" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
              Browse Products →
            </Link>
            <Link to="/sell" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem' }}>
              + Sell an Item
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Buying and selling second-hand goods made effortless, transparent, and safe</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              backgroundColor: 'var(--color-ivory)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📸</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-black)', marginBottom: '0.5rem' }}>
                1. List for Free
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Snap a few clear photos of your unused belongings, set your asking price, and publish your ad in under two minutes.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--color-ivory)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-black)', marginBottom: '0.5rem' }}>
                2. Connect Directly
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Buyers and sellers communicate directly via phone or email with zero middlemen, markups, or hidden platform fees.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--color-ivory)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-black)', marginBottom: '0.5rem' }}>
                3. Trade &amp; Save
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Arrange a convenient local pickup, inspect the item in person, and complete the trade with mutual trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-ivory)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-subtitle">Explore quality pre-owned items across 10 diverse everyday categories</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1.25rem'
          }}>
            {CATEGORIES.filter(c => c !== 'All').map((category) => (
              <Link
                key={category}
                to={`/browse?category=${encodeURIComponent(category)}`}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  transition: 'all var(--transition-normal)',
                  boxShadow: 'var(--shadow-card)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-burgundy)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.backgroundColor = 'var(--color-blush-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.backgroundColor = 'var(--color-white)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {getCategoryIcon(category)}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-black)', marginBottom: '0.25rem' }}>
                  {category}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-burgundy)', fontWeight: '600' }}>
                  View Listings →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Listed Products Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Recently Listed Products</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Latest pre-owned items added by local community sellers
              </p>
            </div>
            <Link to="/browse" className="btn btn-outline btn-sm">
              View All Products ({recentProducts.length > 0 ? recentProducts.length + '+' : '0'}) →
            </Link>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3.5rem 0', color: 'var(--color-burgundy)' }}>
              <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>⏳ Loading latest marketplace listings...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Product Grid */}
          {!loading && recentProducts.length > 0 && (
            <div className="product-grid">
              {recentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && recentProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No Products Listed Yet</h3>
              <p className="empty-state-text">
                Be the first to list an item on VYRA in your area. Free up space at home and connect with local buyers!
              </p>
              <Link to="/sell" className="btn btn-primary">
                + Sell First Item
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
