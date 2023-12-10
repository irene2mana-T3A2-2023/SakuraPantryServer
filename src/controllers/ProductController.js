import Product from '../models/ProductModel.js';
import slugify from 'slugify';

// Get all products in the DB - DONE
// Authorisation: none
export const getAllProducts = async (req, res) => {
  let result = await Product.find({});

  res.status(201).json({
    products: result
  });
};

// Get a specific product by slug - DONE
// Authorisation: none
export const getProduct = async (req, res) => {
  const { slug } = req.params;
  const result = await Product.findOne({ slug });

  if (!result) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(201).json(result);
};

// Search a product by keyword
// Authorisation: none

// Create a new product
// Authorisation: admin only
export const createProduct = async (req, res) => {
  const { name, description, category, stockQuantity, imageUrl, price, isFeatured } = req.body;
  const slug = slugify(name, { lower: true });

  // Check if a product with the same name already exists
  const existingProduct = await Product.findOne({ name });

  if (existingProduct) {
    return res.status(400).json({ message: 'Product with the same name already exists.' });
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
};

// Update a specific product by slug
// Authorisation: admin only
export const updateProduct = async (req, res) => {
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
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({
    product: result
  });
};

// Delete a specific product by slug
// Authorisation: admin only
export const deleteProduct = async (req, res) => {
  const { slug } = req.params;

  const result = await Product.findOneAndDelete({ slug });

  if (!result) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({ message: 'Product successfully deleted' });
};
