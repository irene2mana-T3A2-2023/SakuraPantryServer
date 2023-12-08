import Product from '../models/ProductModel.js';
import slugify from 'slugify';

// Get all products in the DB - DONE
// Authorisation: none
export const getAllProducts = async (req, res) => {
  let result = await Product.find({});

  res.json({
    products: result
  });
};

// Get a specific product by slug - DONE
// Authorisation: none
export const getProduct = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await Product.findOne({ slug });

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error has occured: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Search a product by keyword
// Authorisation: none

// Create a new product
// Authorisation: admin only
export const createProduct = async (req, res) => {
  const { name, description, category, stockQuantity, imageUrl, price, isFeatured } = req.body;

  const slug = slugify(name, { lower: true });

  try {
    const newProduct = new Product({
      name,
      slug,
      description,
      category,
      stockQuantity,
      imageUrl,
      price,
      isFeatured
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error has occured: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a specific product by slug
// Authorisation: admin only
export const updateProduct = async () => {
  // eslint-disable-next-line no-console
  console.log('Update a specific product');
};

// Delete a specific product by slug
// Authorisation: admin only
export const deleteProduct = async () => {
  // eslint-disable-next-line no-console
  console.log('Delete a specific products');
};
