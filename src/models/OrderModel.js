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
    orderItems: [
      {
        quantity: { type: Number, required: true },
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
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
      address: { type: String, required: true },
      city: { type: String, required: true },
      postcode: { type: String, required: true }
    }
  },
  { timestamps: true }
);

OrderSchema.statics = {
  async totalRevenue() {
    const deliveredOrders = await this.find({ status: { $in: ['Delivered'] } });

    const totalRevenue = deliveredOrders.reduce((total, order) => {
      return total + order.totalPrice;
    }, 0);

    return totalRevenue;
  }
};

// This middleware is to perform some logic or actions before saving the document.
OrderSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save an order to the DB!');
  next();
});

// Define Order Model
const Order = mongoose.model('Order', OrderSchema);

export default Order;
