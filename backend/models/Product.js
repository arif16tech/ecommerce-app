const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['S', 'M', 'L', 'XL']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
    trim: true
  },
  sizes: {
    type: [sizeStockSchema],
    required: true,
    validate: {
      validator: function(sizes) {
        return sizes && sizes.length > 0;
      },
      message: 'At least one size must be specified'
    }
  }
}, { 
  timestamps: true 
});

// Method to check if a specific size is available
productSchema.methods.isSizeAvailable = function(size, quantity = 1) {
  const sizeStock = this.sizes.find(s => s.size === size);
  return sizeStock && sizeStock.stock >= quantity;
};

// Method to get total stock across all sizes
productSchema.methods.getTotalStock = function() {
  return this.sizes.reduce((total, size) => total + size.stock, 0);
};

// Indexes for faster queries and full-text search
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
