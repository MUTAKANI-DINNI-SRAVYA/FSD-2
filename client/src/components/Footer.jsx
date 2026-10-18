import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <Logo variant="light" size="md" showTagline={true} />
            </div>
            <p className="footer-brand-desc">
              A luxury, sustainable marketplace where value finds a new life. Discover great second-hand finds, save money, and give quality pre-loved electronics, furniture, fashion, and home essentials a second chance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Marketplace</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/browse">Browse All Categories</Link></li>
              <li><Link to="/sell">Sell an Item</Link></li>
              <li><Link to="/my-listings">Manage My Listings</Link></li>
            </ul>
          </div>

          {/* Full-Stack Architecture */}
          <div>
            <h4 className="footer-heading">Technology Stack</h4>
            <ul className="footer-links" style={{ fontSize: '0.85rem' }}>
              <li>Full-Stack Web Application (MERN)</li>
              <li>Frontend: React.js &amp; Responsive CSS3</li>
              <li>Backend: Node.js &amp; Express.js</li>
              <li>Database: MongoDB &amp; Mongoose</li>
              <li>Security: JWT Auth &amp; Bcrypt Hashing</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {currentYear} VYRA — Value Finds a New Life. Full-Stack Project Demonstration.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Luxury Burgundy Theme</span>
            <span>•</span>
            <span style={{ color: 'var(--color-blush)' }}>B.Tech CSE Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
