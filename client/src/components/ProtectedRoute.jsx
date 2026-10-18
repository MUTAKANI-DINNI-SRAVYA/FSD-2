import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--color-burgundy)', fontWeight: '600', fontSize: '1.1rem' }}>
          ⏳ Verifying authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, saving the requested location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
