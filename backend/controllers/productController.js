const Product = require('../models/Product');


// Get all products
const getAllProducts = async (req, res) => {
  try {

    const { category, subcategory, search } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Product.countDocuments(filter);

    if (search) {
      filter.$text = { $search: search };
      
      // If searching, sort by text score relevance
      const products = await Product.find(filter)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit);
        
      return res.json({
        success: true,
        count: products.length,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        products
      });
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      products
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};


// Get product by ID
const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({
      success: true,
      product
    });

  } catch {
    res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }
};


// Create new product
const createProduct = async (req, res) => {
  try {

    const { name, description, image, price, category, subcategory, sizes } = req.body;

    if (!name || !description || !image || !price || !category || !subcategory || !sizes) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    const validSizes = ['S','M','L','XL'];

    for (const s of sizes) {
      if (!validSizes.includes(s.size) || s.stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid size or stock'
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      image,
      price,
      category,
      subcategory,
      sizes
    });

    res.status(201).json({
      success: true,
      message: 'Product created',
      product
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Product creation failed'
    });
  }
};


// Update product
const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    Object.assign(product, req.body);

    await product.save();

    res.json({
      success: true,
      message: 'Product updated',
      product
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Update failed'
    });
  }
};


// Delete product
const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted'
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Delete failed'
    });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};