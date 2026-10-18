import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect destination after successful login
  const from = location.state?.from?.pathname || '/my-listings';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both your email and password');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with authentication server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="form-card" style={{ maxWidth: '480px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <Logo variant="dark" size="md" showTagline={true} />
            </div>
            <h1 className="section-title">Sign In to VYRA</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Access your listed products, manage your items, and trade sustainably.
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
                Password <span className="required">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
                disabled={submitting}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
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
            Don&rsquo;t have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--color-burgundy)', fontWeight: '700', textDecoration: 'underline' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
