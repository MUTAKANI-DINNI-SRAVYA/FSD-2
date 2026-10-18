import { CATEGORIES, CONDITIONS } from '../services/mockData';

export default function CategoryFilter({
  selectedCategory = 'All',
  onSelectCategory,
  selectedCondition = 'All',
  onSelectCondition,
  selectedSort = 'newest',
  onSelectSort
}) {
  return (
    <div className="filter-bar" aria-label="Product filters and sorting">
      {/* Category Pills */}
      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="filter-label">Sort:</span>
          <select
            className="select-control"
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="newest">✨ Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Condition Pills */}
      <div className="filter-row" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="filter-group">
          <span className="filter-label">Condition:</span>
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              type="button"
              className={`filter-pill ${selectedCondition === cond ? 'active' : ''}`}
              onClick={() => onSelectCondition(cond)}
            >
              {cond}
            </button>
          ))}
        </div>

        {/* Quick Reset Filter */}
        {(selectedCategory !== 'All' || selectedCondition !== 'All') && (
          <button
            type="button"
            onClick={() => {
              onSelectCategory('All');
              onSelectCondition('All');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-burgundy)',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
