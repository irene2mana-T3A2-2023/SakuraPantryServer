import mongoose from 'mongoose';
import ProductSchema from './ProductModel.js';

const Schema = mongoose.Schema;

// Define Category Schema
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  { timestamps: true }
);

// This middleware is to perform some logic or actions before saving the document.
CategorySchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a category to the DB!');
  next();
});

// Define Category Model
const Category = mongoose.model('Category', CategorySchema);

export default Category;
