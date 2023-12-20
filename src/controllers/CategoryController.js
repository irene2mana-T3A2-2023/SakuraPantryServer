import slugify from 'slugify';
import Category from '../models/CategoryModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../middlewares/appError.js';

// @desc    View all categories
// @route   GET /api/categories
// @access  Private/Admin
// eslint-disable-next-line no-unused-vars
export const getAllCategories = catchAsync(async (req, res, next) => {
  //  Find all category documents and sorts these categories in descending order based on their creation date in the database.
  let results = await Category.find({}).sort({ createdAt: -1 });

  res.status(201).json(results);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });

  // Check if the category with the same name already exists
  const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });

  if (existingCategory) {
    return next(new AppError('Category with the same name or slug already exists', 400));
  }

  // If no existing category, create a new one
  const newCategory = await Category.create({
    name,
    slug
  });

  res.status(201).json(newCategory);
});

// @desc    Update a category by slug
// @route   PATCH /api/categories/:slug
// @access  Private/Admin
export const updateCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  let result = await Category.findOneAndUpdate({ slug: slug }, req.body, {
    new: true,
    runValidators: true
  });

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json(result);
});

// @desc    Delete a category by slug
// @route   DELETE /api/categories/:slug
// @access  Private/Admin
export const deleteCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const result = await Category.findOneAndDelete({ slug });

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ message: 'Category successfully deleted' });
});
