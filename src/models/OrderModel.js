import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define Order Schema
const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'PayPal', 'Stripe', 'Other'],
      required: true
    },
    shippingAddress: {
      street: {
        type: String,
        required: false,
        unique: false
      },
      city: {
        type: String,
        required: false,
        unique: false
      },
      state: {
        type: String,
        required: false,
        unique: false
      },
      postcode: {
        type: String,
        required: false,
        unique: false
      }
    }
  },
  { timestamps: true }
);

// This middleware is to perform some logic or actions before saving the document.
OrderSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save an order to the DB!');
  next();
});

// Define Order Model
const Order = mongoose.model('Order', OrderSchema);

export default Order;
