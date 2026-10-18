import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: ''
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please provide your name, email, and a password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await register(formData);
      if (res.success) {
        navigate('/my-listings');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with registration server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="form-card" style={{ maxWidth: '540px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <Logo variant="dark" size="md" showTagline={true} />
            </div>
            <h1 className="section-title">Join VYRA</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Start buying, selling, and giving pre-loved things a new life.
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-control"
                placeholder="e.g., Priya Sharma"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password (min. 6 characters) <span className="required">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-control"
                placeholder="Choose a secure password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">City / Neighborhood</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="form-control"
                  placeholder="e.g., Bangalore, Indiranagar"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
                disabled={submitting}
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.25rem',
            fontSize: '0.92rem',
            color: 'var(--color-text-secondary)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-burgundy)', fontWeight: '700', textDecoration: 'underline' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
