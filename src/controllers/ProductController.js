import Product from '../models/ProductModel.js';
import Category from '../models/CategoryModel.js';
import slugify from 'slugify';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../middlewares/appError.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// eslint-disable-next-line no-unused-vars
export const getAllProducts = catchAsync(async (req, res, next) => {
  let results = await Product.find({})
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .sort({ createdAt: -1 });
  res.status(200).json(results);
});

// @desc    Get new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
// Get the five most recently created products, ordered from the newest to the oldest.
// eslint-disable-next-line no-unused-vars
export const getNewArrivalProducts = catchAsync(async (req, res, next) => {
  let results = await Product.find({})
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json(results);
});

// @desc    Get relative products
// @route   GET /api/products/relative-products
// @access  Public
// Get the top five products related to a specific category
// eslint-disable-next-line no-unused-vars
export const relativeProductsByCategory = catchAsync(async (req, res, next) => {
  //It first finds the category using the slug provided in the request params.
  const category = await Category.findOne({ slug: req.params.categorySlug });
  //If the category is not found, it returns an empty array.
  if (!category) {
    return res.status(200).json([]);
  }
  //If the category is found, it then finds up to 5 products that belongs to this category.
  const relativeProducts = await Product.find({ category: category._id })
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .limit(5);

  res.status(200).json(relativeProducts);
});

// @desc    Get relative products
// @route   GET /api/products/
// @access  Public
// Get the top five products where the 'isFeatured' attribute is set to true.
// eslint-disable-next-line no-unused-vars
export const getFeatureProducts = catchAsync(async (req, res, next) => {
  let results = await Product.find({ isFeatured: true })
    .populate({ path: 'category', select: 'name slug' })
    .limit(5);

  res.status(200).json(results);
});

// @desc    Get a product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const result = await Product.findOne({ slug }).populate({
    path: 'category',
    select: 'name slug'
  });
  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json(result);
});

// @desc    Search a product by keyword
// @route   GET /api/products/search?keyword=
// @access  Public
// eslint-disable-next-line no-unused-vars
export const searchProduct = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword;
  const results = await Product.find({
    // Use regex to perform a case-insensitive search
    name: { $regex: new RegExp(keyword, 'i') }
  }).populate({
    path: 'category',
    select: 'name slug'
  });
  res.status(200).json(results);
});

// @desc    Create a product
// @route   GET /api/products
// @access  Private/Admin
export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, categorySlug, stockQuantity, imageUrl, price, isFeatured } = req.body;

  const category = await Category.findOne({ slug: categorySlug }).exec();

  if (!category) {
    return next(new AppError('No such category exists!', 404));
  }

  const slug = slugify(name, { lower: true });

  // Check if a product with the same name already exists
  const existingProduct = await Product.findOne({ $or: [{ name }, { slug }] });

  if (existingProduct) {
    return next(new AppError('Product with the same name or slug already exists', 409));
  }

  // If no existing product, create a new one
  const newProduct = await Product.create({
    name,
    slug,
    description,
    category: category._id,
    stockQuantity,
    imageUrl,
    price,
    isFeatured
  });

  res.status(201).json(newProduct);
});

// @desc    Update a product by slug
// @route   PATCH /api/products/:slug
// @access  Private/Admin
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

  res.status(200).json(result);
});

// @desc    Delete a product by slug
// @route   DELETE /api/products/:slug
// @access  Private/Admin
export const deleteProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const result = await Product.findOneAndDelete({ slug });

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ message: 'Product successfully deleted' });
});
