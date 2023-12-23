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
      enum: ['Credit Card', 'PayPal', 'Stripe'],
      required: true
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postcode: { type: String, required: true }
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (phone) {
          const lastNameRegex = /^[0-9]+$/;
          return lastNameRegex.test(phone);
        },
        message: 'Phone number can contain only numbers.'
      }
    }
  },
  { timestamps: true }
);

// Extending the OrderSchema with custom static methods.
OrderSchema.statics = {
  // Calculates the total revenue from orders that have been delivered.
  async totalRevenue() {
    // Fetching all orders with the status 'Delivered'.
    const deliveredOrders = await this.find({ status: { $in: ['Delivered'] } });

    // Reducing the array of delivered orders to calculate the total revenue.
    const totalRevenue = deliveredOrders.reduce((total, order) => {
      return total + order.totalPrice;
    }, 0);

    // Returning the calculated total revenue.
    return totalRevenue;
  }
};

// Define Order Model
const Order = mongoose.model('Order', OrderSchema);

export default Order;
