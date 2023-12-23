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

// Function to import dev data
export const importData = async () => {
  try {
    const seedUsers =
      envConfig.env === 'production'
        ? usersData.filter((user) => user.role !== 'admin')
        : usersData;

    await Category.create(categories);
    await Product.create(products);

    // eslint-disable-next-line
    console.log('Products and categories seeded successfully');

    for (let user of seedUsers) {
      const newUser = new User(user);
      await newUser.save();
    }
    // eslint-disable-next-line
    console.log('Users seeded successfully');
    // eslint-disable-next-line no-console
    console.log('Data successfully loaded!');
  } catch (importError) {
    if (envConfig.env === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error during data import:', importError);
    }
  }
};

// Function to delete dev data
export const deleteData = async () => {
  try {
    // Drop existing data
    if (envConfig.env === 'production') {
      await User.deleteMany({ role: { $ne: 'admin' } });
    } else {
      await User.deleteMany({});
    }
    // eslint-disable-next-line
    console.log('Existing users dropped');
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

databaseConnect()
  .then(async () => {
    // Clean up database
    await deleteData();
    // Seeding User, Category, Product data
    await importData();

    // Fetch users excluding the admin
    const sampleUsers = await User.find({ role: { $ne: 'admin' } }).limit(10);

    // Fetch some products
    const sampleProducts = await Product.find().limit(5);

    // Possible order statuses
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const paymentMethods = ['Credit Card', 'PayPal', 'Stripe'];

    for (let i = 0; i < 15; i++) {
      const user = sampleUsers[i % sampleUsers.length];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const numberOfItems = Math.floor(Math.random() * 3) + 1;
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      // Create a map to combine quantities of duplicated items
      let productMap = new Map();
      for (let j = 0; j < numberOfItems; j++) {
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5

        if (productMap.has(product._id.toString())) {
          productMap.set(product._id.toString(), productMap.get(product._id.toString()) + quantity);
        } else {
          productMap.set(product._id.toString(), quantity);
        }
      }

      let orderItems = Array.from(productMap, ([product, quantity]) => ({ product, quantity }));
      let totalPrice = orderItems.reduce(
        (total, item) =>
          total +
          item.quantity * sampleProducts.find((p) => p._id.toString() === item.product).price,
        0
      );

      // Create and save the order
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

      await order.save();
      // eslint-disable-next-line
      console.log('Order feeded successfully');
    }
  })
  .then(async () => {
    try {
      await mongoose.connection.close();
      // eslint-disable-next-line no-console
      console.log('Database disconnected!');
    } catch (disconnectError) {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting from the database:', disconnectError);
    }
  })
  .catch((error) => {
    if (envConfig.env === 'development') {
      // eslint-disable-next-line no-console
      console.error('An unexpected error occurred:', error);
    }
  });
