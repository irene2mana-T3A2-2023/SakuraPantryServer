import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define Product Schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    productSlug: {
        type: String,
        required: true,
        unique: true
    }
  },
  { timestamps: true }
);

// This middleware is to perform some logic or actions before saving the document.
ProductSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a user to the DB!');
  next();
});

// Define Product Model
const Product = mongoose.model('Product', ProductSchema);

export default Product;