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
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false,
      unique: false
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    stockQuantity: {
      type: Number,
      required: false,
      default: 0
    },
    imageUrl: {
      type: String,
      required: false,
      unique: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true }
);

// This middleware is to perform some logic or actions before saving the document.
ProductSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a product to the DB!');
  next();
});

// Define Product Model
const Product = mongoose.model('Product', ProductSchema);

export default Product;
