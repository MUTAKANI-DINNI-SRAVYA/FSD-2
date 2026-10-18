import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { api } from '../services/api';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params from URL if present
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const s = searchParams.get('search');
    if (s) setSearchTerm(s);
  }, [searchParams]);

  // Fetch products from API when filters change
  useEffect(() => {
    let isMounted = true;

    async function loadFilteredProducts() {
      try {
        setLoading(true);
        setError(null);

        const result = await api.getProducts({
          search: searchTerm,
          category: selectedCategory,
          condition: selectedCondition,
          sort: selectedSort
        });

        if (isMounted) {
          if (result.success) {
            setProducts(result.data);
          } else {
            setError(result.error || 'Failed to fetch products');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Error loading marketplace catalog');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFilteredProducts();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory, selectedCondition, selectedSort]);

  // Handler for search form submission
  const handleSearch = (term) => {
    setSearchTerm(term);
    setSearchParams(prev => {
      if (term) prev.set('search', term);
      else prev.delete('search');
      return prev;
    });
  };

  // Handler for category filter
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchParams(prev => {
      if (category !== 'All') prev.set('category', category);
      else prev.delete('category');
      return prev;
    });
  };

  const handleResetAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedSort('newest');
    setSearchParams({});
  };

  return (
    <div className="section">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Browse Marketplace Catalog</h1>
          <p className="section-subtitle">
            Explore authentic pre-owned items listed by local community members. Filter by category, condition, or price.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '640px', marginTop: '1.25rem' }}>
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchTerm}
              placeholder="Search by product name, brand, model, or keywords..."
            />
          </div>
        </div>

        {/* Filter and Sorting Bar */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          selectedCondition={selectedCondition}
          onSelectCondition={setSelectedCondition}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
        />

        {/* Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
            {searchTerm && <span> for &ldquo;<strong>{searchTerm}</strong>&rdquo;</span>}
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {selectedCondition !== 'All' && <span> ({selectedCondition} condition)</span>}
          </p>

          {(searchTerm || selectedCategory !== 'All' || selectedCondition !== 'All') && (
            <button
              onClick={handleResetAll}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-burgundy)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-burgundy)' }}>
            <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>⏳ Fetching available items from database...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No Matching Products Found</h3>
            <p className="empty-state-text">
              We couldn&rsquo;t find any items matching your active search and filter criteria. Try adjusting your keywords or clearing your filters.
            </p>
            <button type="button" className="btn btn-secondary" onClick={handleResetAll}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
