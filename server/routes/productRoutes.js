const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// In-memory fallback repository when MongoDB server is not running
let inMemoryProducts = sampleProducts.map((p, idx) => ({
  ...p,
  _id: `prod-00${idx + 1}`,
  seller: `seed-seller-${idx + 1}`,
  createdAt: new Date(Date.now() - idx * 3600000 * 24).toISOString()
}));

// ============================================================================
// 1. GET /api/products
// Retrieve all products with optional search, category, condition, and sort
// ============================================================================
router.get('/', async (req, res, next) => {
  try {
    const { search, category, condition, sort } = req.query;

    if (getIsConnected()) {
      const filter = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (condition && condition !== 'All') {
        filter.condition = condition;
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc') {
        sortOptions = { price: 1 };
      } else if (sort === 'price_desc') {
        sortOptions = { price: -1 };
      }

      const products = await Product.find(filter).sort(sortOptions).populate('seller', 'name email');
      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    }

    // Fallback in-memory processing
    let result = [...inMemoryProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (condition && condition !== 'All') {
      result = result.filter(p => p.condition === condition);
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
      source: 'in-memory-fallback'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 2. GET /api/products/my-listings
// Protected: Retrieve listings belonging to the authenticated user
// ============================================================================
router.get('/my-listings', protect, async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    if (getIsConnected()) {
      // Find products where seller equals current user
      const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    }

    // Fallback in-memory listings
    const userProducts = inMemoryProducts.filter(p =>
      (p.seller && p.seller.toString() === userId) ||
      (p.sellerContact && p.sellerContact.includes(req.user.email))
    );

    res.status(200).json({
      success: true,
      count: userProducts.length,
      data: userProducts
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 3. GET /api/products/:id
// Retrieve a single product by its unique ID
// ============================================================================
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const memProduct = inMemoryProducts.find(p => p._id === id);
        if (memProduct) return res.status(200).json({ success: true, data: memProduct });
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }

      const product = await Product.findById(id).populate('seller', 'name email phone city');
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      return res.status(200).json({ success: true, data: product });
    }

    const product = inMemoryProducts.find(p => p._id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 4. POST /api/products
// Protected: Create a new product listing owned by the logged-in user
// ============================================================================
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, description, price, category, condition, imageUrl, location, sellerContact } = req.body;

    // Validation
    if (!name || !description || !price || !category || !condition || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product details'
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    const contactInfo = sellerContact && sellerContact.trim()
      ? sellerContact.trim()
      : `${req.user.email}${req.user.phone ? ' | ' + req.user.phone : ''}`;

    const newProductData = {
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category,
      condition,
      imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      seller: req.user._id,
      sellerName: req.user.name,
      sellerContact: contactInfo,
      location: location.trim()
    };

    if (getIsConnected()) {
      const createdProduct = await Product.create(newProductData);
      return res.status(201).json({
        success: true,
        message: 'Product listed successfully',
        data: createdProduct
      });
    }

    // In-memory fallback creation
    const memCreated = {
      ...newProductData,
      _id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    inMemoryProducts.unshift(memCreated);

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      data: memCreated
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 5. PUT /api/products/:id
// Protected: Update an existing product listing with strict ownership check
// ============================================================================
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Ownership authorization check
      if (product.seller && product.seller.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only edit your own listings'
        });
      }

      // Update allowed fields
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price ? Number(req.body.price) : product.price,
          category: req.body.category,
          condition: req.body.condition,
          imageUrl: req.body.imageUrl,
          location: req.body.location,
          sellerContact: req.body.sellerContact
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    }

    // Fallback in-memory update with ownership check
    const idx = inMemoryProducts.findIndex(p => p._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (inMemoryProducts[idx].seller && inMemoryProducts[idx].seller.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only edit your own listings'
      });
    }

    inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...req.body };
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: inMemoryProducts[idx]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 6. DELETE /api/products/:id
// Protected: Delete a product listing with strict ownership check
// ============================================================================
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();

    if (getIsConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Ownership authorization check
      if (product.seller && product.seller.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only delete your own listings'
        });
      }

      await Product.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Product listing deleted successfully'
      });
    }

    // In-memory fallback delete with ownership check
    const idx = inMemoryProducts.findIndex(p => p._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (inMemoryProducts[idx].seller && inMemoryProducts[idx].seller.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete your own listings'
      });
    }

    inMemoryProducts = inMemoryProducts.filter(p => p._id !== id);
    res.status(200).json({
      success: true,
      message: 'Product listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
