import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container navbar-container">
        {/* VYRA Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center' }}>
          <Logo variant="light" size="md" />
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="navbar-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/browse"
              className={`navbar-link ${isActive('/browse') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Browse Products
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/my-listings"
                  className={`navbar-link ${isActive('/my-listings') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  My Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="btn-nav-sell"
                  onClick={closeMobileMenu}
                >
                  + Sell an Item
                </Link>
              </li>
              {/* User Account Badge & Logout */}
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'var(--color-white)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                  title={`Logged in as ${user?.email}`}
                >
                  👤 {user?.name ? user.name.split(' ')[0] : 'Account'}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'var(--color-white)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn-nav-sell"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
