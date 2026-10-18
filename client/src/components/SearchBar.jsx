import { useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '', placeholder = "Search textbooks, calculators, cycles, laptops..." }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form className="search-bar-wrapper" onSubmit={handleSubmit} role="search">
      <span style={{ color: 'var(--color-burgundy)', fontSize: '1.1rem', paddingLeft: '0.4rem' }}>
        🔍
      </span>
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search marketplace products"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.2rem 0.5rem'
          }}
          title="Clear search"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <button type="submit" className="btn btn-primary btn-sm">
        Search
      </button>
    </form>
  );
}
