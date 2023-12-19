import mongoose from 'mongoose';

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
    }
  },
  { timestamps: true }
);

// Define Category Model
const Category = mongoose.model('Category', CategorySchema);

export default Category;
