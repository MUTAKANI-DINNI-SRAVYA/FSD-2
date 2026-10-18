const mongoose = require('mongoose');

// Define Schema for Universal Second-Hand Marketplace Product Listing
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be greater than 0']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Electronics',
          'Furniture',
          'Fashion',
          'Home and Kitchen',
          'Books and Education',
          'Sports and Fitness',
          'Vehicles and Accessories',
          'Toys and Baby Products',
          'Tools and Equipment',
          'Other'
        ],
        message: '{VALUE} is not a supported category'
      }
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['Like New', 'Good', 'Fair'],
        message: '{VALUE} is not a valid condition'
      }
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sellerName: {
      type: String,
      required: [true, 'Seller name is required'],
      trim: true
    },
    sellerContact: {
      type: String,
      required: [true, 'Seller contact information is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'City or location is required'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compile schema into Mongoose model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
