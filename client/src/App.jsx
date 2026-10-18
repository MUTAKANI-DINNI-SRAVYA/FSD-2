import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ProductDetails from './pages/ProductDetails';
import SellItem from './pages/SellItem';
import MyListings from './pages/MyListings';
import EditItem from './pages/EditItem';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main id="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Require Authentication) */}
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <SellItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <div className="empty-state">
                    <div className="empty-state-icon">404</div>
                    <h1 className="empty-state-title">Page Not Found</h1>
                    <p className="empty-state-text">
                      The page you are looking for does not exist or has been moved.
                    </p>
                    <a href="/" className="btn btn-primary">
                      Return to Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}
