require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getIsConnected } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to track database connection state on app locals
app.use((req, res, next) => {
  req.app.locals.dbConnected = getIsConnected();
  next();
});

// Core Middleware
app.use(cors({
  origin: '*', // Allow React frontend from any local origin (e.g., http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Body parser for application/json

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'VYRA Universal Second-Hand Marketplace REST API is operational',
    databaseConnected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 404 Route Handler for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 [VYRA Server Running]: http://localhost:${PORT}`);
  console.log(`📡 [API Health Check]: http://localhost:${PORT}/api/health`);
  console.log(`🔐 [Auth Endpoints]: http://localhost:${PORT}/api/auth`);
  console.log(`🛍️ [Products Endpoints]: http://localhost:${PORT}/api/products`);
  console.log(`=======================================================`);
});
