import slugify from 'slugify';
import Product from '../models/ProductModel.js';
import Category from '../models/CategoryModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../middlewares/appError.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// eslint-disable-next-line no-unused-vars
export const getAllProducts = catchAsync(async (req, res, next) => {
  // Find all product documents in the database, populates each with corresponding category data (name and slug), and sorts them in descending order based on their creation date.
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
    //Populate each products with its associated category information.
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .limit(5);

  res.status(200).json(relativeProducts);
});

// @desc    Get featured products
// @route   GET /api/products/feature
// @access  Public
// Get the top five products where the 'isFeatured' attribute is set to true.
// eslint-disable-next-line no-unused-vars
export const getFeatureProducts = catchAsync(async (req, res, next) => {
  // Filter products by isFeatured.
  let results = await Product.find({ isFeatured: true })
    //Populate each products with its associated category information.
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

// @desc    Search a product by keyword and categorySlug
// @route   GET /api/products/search?k=miso&c=seasoning
// @access  Public
// eslint-disable-next-line no-unused-vars
export const searchProduct = catchAsync(async (req, res, next) => {
  // Retrieve keyword(k) and categorySlug(c) from URL paramaters.
  const keyword = req.query.k;
  const categorySlug = req.query.c;
  // Implement pagination to display 8 items per page.
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  // Initialise MongoDB query to search products.
  let query = Product.find({});
  // If categorySlug is present in the query parameters.
  // If categorySlug exists, search the category collection in the db for a category with a matching slug.
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    // If such a category is found, the query object is updated to filter products belonging to this category.
    if (category) {
      // Set the condition that the category field of the product collection should be equal the found category's_id.
      query = query.where('category').equals(category._id);
    }
  }
  //If keyword is present.
  if (keyword) {
    // If keyword exists, a search condition is created where name or description of the product contains the keyword.
    // By using regex for  pattern matching with making the search case-insensitive.
    const searchQuery = { $regex: keyword, $options: 'i' };
    query = query.or([{ name: searchQuery }, { description: searchQuery }]);
  }
  //Populate each products with its associated category information.
  const totalResults = await Product.countDocuments(query);
  const results = await query.skip(skip).limit(limit).populate({
    path: 'category',
    select: 'name slug'
  });

  res.status(200).json({
    // Total number of results in the entire dataset.
    totalResults,
    // Total number of pages. This is calculated by dividing the total results by the number of items per page and rounding up to the nearest whole number.
    totalPages: Math.ceil(totalResults / limit),
    // The current page number that this response represents.
    currentPage: page,
    results
  });
});

// @desc    Create a product
// @route   GET /api/products
// @access  Private/Admin
export const createProduct = catchAsync(async (req, res, next) => {
  // Destructuring relevant fields from the request body.
  const { name, description, categorySlug, stockQuantity, imageUrl, price, isFeatured } = req.body;

  // Finding the category by its slug.
  const category = await Category.findOne({ slug: categorySlug }).exec();

  // If the category doesn't exist, return an error.
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
