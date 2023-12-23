import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js';
import databaseConnect from '../dbConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const categories = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8')
);
export const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8')
);
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));

// Function to import development data. This function will seed categories, products, and users.
export const importData = async () => {
  try {
    // Determine the set of users to seed based on the environment.
    // In production, exclude users with the 'admin' role to prevent overwriting existing admin accounts.
    // In development, use all users from the data set for comprehensive testing.
    const seedUsers =
      envConfig.env === 'production'
        ? usersData.filter((user) => user.role !== 'admin')
        : usersData;

    // Seed categories and products into the database.
    await Category.create(categories);
    await Product.create(products);

    // eslint-disable-next-line
    console.log('Products and categories seeded successfully');

    // Seed users into the database.
    for (let user of seedUsers) {
      const newUser = new User(user);
      await newUser.save();
    }
    // eslint-disable-next-line
    console.log('Users seeded successfully');
  } catch (importError) {
    // Log errors only in development environment.
    if (envConfig.env === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error during data import:', importError);
    }
  }
};

// Function to delete dev data from the database
export const deleteData = async () => {
  try {
    // In production, only delete non-admin users to preserve admin accounts.
    // In other environments, delete all users.
    if (envConfig.env === 'production') {
      await User.deleteMany({ role: { $ne: 'admin' } });
    } else {
      await User.deleteMany({});
    }
    // eslint-disable-next-line
    console.log('Existing users dropped');

    // Delete all categories, products, and orders irrespective of the environment.
    await Category.deleteMany({});
    // eslint-disable-next-line
    console.log('Existing categories dropped');
    await Product.deleteMany({});
    // eslint-disable-next-line
    console.log('Existing products dropped');
    await Order.deleteMany({});
    // eslint-disable-next-line
    console.log('Existing orders dropped');
  } catch (deleteError) {
    // eslint-disable-next-line no-console
    console.error('Error during data deleting:', deleteError);
  }
};

// Connect to the database and start the seeding process
databaseConnect()
  .then(async () => {
    // Clean up database
    await deleteData();
    // Import new data for Users, Categories, and Products
    await importData();

    // Fetch a sample of non-admin users for order seeding
    const sampleUsers = await User.find({ role: { $ne: 'admin' } }).limit(10);

    // Fetch a sample of products for order seeding
    const sampleProducts = await Product.find().limit(5);

    // Define possible order statuses and payment methods
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentMethods = ['Credit Card', 'PayPal', 'Stripe'];

    // Seed 15 orders with random configurations
    for (let i = 0; i < 15; i++) {
      // Select a user in a round-robin fashion from the sample user list
      const user = sampleUsers[i % sampleUsers.length];

      // Randomly select an order status from the predefined list
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      // Determine a random number of items for the order (1 to 3)
      const numberOfItems = Math.floor(Math.random() * 3) + 1;

      // Randomly select a payment method from the predefined list
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      // Initialize a map to store product quantities and avoid duplication
      let productMap = new Map();
      for (let j = 0; j < numberOfItems; j++) {
        // Select a random product from the sample products
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];

        // Determine a random quantity for the product (1 to 5)
        const quantity = Math.floor(Math.random() * 5) + 1;

        // If the product is already in the map, increase its quantity
        if (productMap.has(product._id.toString())) {
          productMap.set(product._id.toString(), productMap.get(product._id.toString()) + quantity);
        } else {
          // Otherwise, add the new product with its quantity to the map
          productMap.set(product._id.toString(), quantity);
        }
      }
      // Convert the map entries to an array of order items
      let orderItems = Array.from(productMap, ([product, quantity]) => ({ product, quantity }));

      // Calculate the total price for the order
      let totalPrice = orderItems.reduce(
        (total, item) =>
          total +
          item.quantity * sampleProducts.find((p) => p._id.toString() === item.product).price,
        0
      );

      // Construct the order object with all details
      const order = new Order({
        user: user._id,
        orderItems,
        totalPrice,
        status: randomStatus,
        paymentMethod: randomPaymentMethod,
        shippingAddress: {
          address: '123 Sample Street',
          city: 'Sample City',
          state: 'Sample State',
          postcode: '12345'
        },
        phone: '1234567890'
      });

      // Save the order to the database
      await order.save();
    }

    // eslint-disable-next-line
    console.log('Order seeded successfully');
  })
  .then(async () => {
    try {
      // Attempt to close the connection to the MongoDB database
      await mongoose.connection.close();
      // eslint-disable-next-line no-console
      console.log('Database disconnected!');
    } catch (disconnectError) {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting from the database:', disconnectError);
    }
  })
  .catch((error) => {
    // In development environment, log any unexpected errors that occur during the seeding process
    if (envConfig.env === 'development') {
      // eslint-disable-next-line no-console
      console.error('An unexpected error occurred:', error);
    }
  });
