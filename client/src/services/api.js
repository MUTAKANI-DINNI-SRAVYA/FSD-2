// API Service layer for VYRA Universal Second-Hand Marketplace
// Connects to Express REST API at http://localhost:5000/api
// With JWT authentication header integration and resilient offline fallback.

import { SAMPLE_PRODUCTS } from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';
const STORAGE_KEY = 'vyra_marketplace_products_v3';

// Helper to get auth headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('vyra_token') || localStorage.getItem('remarket_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to initialize local storage cache with sample products if empty
const getLocalProducts = () => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PRODUCTS));
    return SAMPLE_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(local);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PRODUCTS));
      return SAMPLE_PRODUCTS;
    }
    return parsed;
  } catch {
    return SAMPLE_PRODUCTS;
  }
};

const saveLocalProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const api = {
  // Authentication API endpoints
  auth: {
    async register(userData) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          signal: AbortSignal.timeout(4000)
        });
        const data = await response.json();
        return data;
      } catch {
        // Fallback simulated registration
        const mockUser = {
          _id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          city: userData.city || ''
        };
        const mockToken = `mock-jwt-token-${Date.now()}`;
        return { success: true, token: mockToken, user: mockUser };
      }
    },

    async login(email, password) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          signal: AbortSignal.timeout(4000)
        });
        const data = await response.json();
        return data;
      } catch {
        // Fallback simulated login
        const mockUser = {
          _id: 'user-default-101',
          name: email.split('@')[0],
          email: email,
          phone: '+91 98765 00000',
          city: 'Bangalore'
        };
        const mockToken = `mock-jwt-token-${Date.now()}`;
        return { success: true, token: mockToken, user: mockUser };
      }
    },

    async getMe(token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: AbortSignal.timeout(3000)
        });
        const data = await response.json();
        return data;
      } catch {
        return { success: false, message: 'Server offline' };
      }
    }
  },

  // GET /api/products (Public Catalog with search, category, condition, sort)
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.condition && params.condition !== 'All') query.append('condition', params.condition);
    if (params.sort) query.append('sort', params.sort);

    try {
      const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data || data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed or offline; using local data fallback:', err.message);
      
      let products = [...getLocalProducts()];
      
      if (params.search) {
        const s = params.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(s) || 
          p.description.toLowerCase().includes(s)
        );
      }
      
      if (params.category && params.category !== 'All') {
        products = products.filter(p => p.category === params.category);
      }
      
      if (params.condition && params.condition !== 'All') {
        products = products.filter(p => p.condition === params.condition);
      }
      
      if (params.sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return { success: true, data: products, source: 'fallback' };
    }
  },

  // GET /api/products/my-listings (Protected: logged-in user listings)
  async getMyListings() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/my-listings`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.data || data, source: 'api' };
    } catch {
      // Fallback: return listings created locally by current user
      const savedUser = localStorage.getItem('vyra_user') || localStorage.getItem('remarket_user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      const products = getLocalProducts();

      const userItems = currentUser
        ? products.filter(p => (p.seller && p.seller === currentUser._id) || (p.sellerContact && p.sellerContact.includes(currentUser.email)))
        : [];

      return { success: true, data: userItems, source: 'fallback' };
    }
  },

  // GET /api/products/:id (Public: Single Product Details)
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        signal: AbortSignal.timeout(3000)
      });
      if (!response.ok) throw new Error('Product not found on server');
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'api' };
    } catch {
      const products = getLocalProducts();
      const product = products.find(p => p._id === id);
      if (!product) return { success: false, error: 'Product not found' };
      return { success: true, data: product, source: 'fallback' };
    }
  },

  // POST /api/products (Protected: Create new listing)
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
        signal: AbortSignal.timeout(4000)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error creating product');
      }
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'api' };
    } catch (err) {
      const savedUser = localStorage.getItem('vyra_user') || localStorage.getItem('remarket_user');
      const currentUser = savedUser ? JSON.parse(savedUser) : { _id: 'user-local', name: 'User' };

      const products = getLocalProducts();
      const newProduct = {
        ...productData,
        _id: 'prod-' + Date.now(),
        seller: currentUser._id,
        createdAt: new Date().toISOString()
      };
      products.unshift(newProduct);
      saveLocalProducts(products);
      return { success: true, data: newProduct, source: 'fallback' };
    }
  },

  // PUT /api/products/:id (Protected: Update product)
  async updateProduct(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
        signal: AbortSignal.timeout(4000)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Server error updating product');
      }
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'api' };
    } catch (err) {
      const products = getLocalProducts();
      const index = products.findIndex(p => p._id === id);
      if (index === -1) return { success: false, error: err.message || 'Product not found' };
      products[index] = { ...products[index], ...updateData };
      saveLocalProducts(products);
      return { success: true, data: products[index], source: 'fallback' };
    }
  },

  // DELETE /api/products/:id (Protected: Delete product)
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(4000)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Server error deleting product');
      }
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'api' };
    } catch (err) {
      let products = getLocalProducts();
      products = products.filter(p => p._id !== id);
      saveLocalProducts(products);
      return { success: true, source: 'fallback' };
    }
  }
};
