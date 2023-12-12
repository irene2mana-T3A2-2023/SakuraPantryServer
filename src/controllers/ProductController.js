/* eslint-disable no-unused-vars */
import Product from '../models/ProductModel.js';
import slugify from 'slugify';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../middlewares/appError.js';

// Get all products in the DB - DONE
// Authorisation: none
export const getAllProducts = catchAsync(async (req, res, next) => {
  let result = await Product.find({});

  res.status(201).json({
    products: result
  });
});

// Get a specific product by slug - DONE
// Authorisation: none
export const getProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const result = await Product.findOne({ slug });

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(201).json(result);
});

// Search a product by keyword
// Authorisation: none
export const searchProduct = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword;
  const results = await Product.find({
    // Use regex to perform a case-insensitive search
    name: { $regex: new RegExp(keyword, 'i') }
  });
  res.status(200).json(results);
});

// Create a new product
// Authorisation: admin only
export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, category, stockQuantity, imageUrl, price, isFeatured } = req.body;
  const slug = slugify(name, { lower: true });

  // Check if a product with the same name already exists
  const existingProduct = await Product.findOne({ $or: [{ name }, { slug }] });

  if (existingProduct) {
    return next(new AppError('Product with the same name or slug already exists', 400));
  }
  
  // If no existing product, create a new one
  const newProduct = await Product.create({
    name,
    slug,
    description,
    category,
    stockQuantity,
    imageUrl,
    price,
    isFeatured
  });

  res.status(201).json(newProduct);
});

// Update a specific product by slug
// Authorisation: admin only
export const updateProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  let result = await Product.findOneAndUpdate(
    { slug: slug }, // Find by slug
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    product: result
  });
});

// Delete a specific product by slug
// Authorisation: admin only
export const deleteProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const result = await Product.findOneAndDelete({ slug });

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ message: 'Product successfully deleted' });
});

// Get product stats
// This route is not yet defined