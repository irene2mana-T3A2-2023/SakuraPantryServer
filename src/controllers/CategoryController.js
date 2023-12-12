/* eslint-disable no-unused-vars */
import slugify from 'slugify';
import Category from '../models/CategoryModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../middlewares/appError.js';

// Get a list of all categories - DONE
// Authorisation: admin only
export const getAllCategories = catchAsync(async (req, res, next) => {
  let result = await Category.find({});

  res.status(201).json({
    categories: result
  });
});

// Create a new category - DONE
// Authorisation: admin only 
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

// Update a specific category by slug - DONE
// Authorisation: admin only 
export const updateCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  let result = await Category.findOneAndUpdate(
    { slug: slug },
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

// Delete a specific category by slug
// Authorisation: admin only 
export const deleteCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const result = await Category.findOneAndDelete({ slug });

  if (!result) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ message: 'Category successfully deleted' });
});
