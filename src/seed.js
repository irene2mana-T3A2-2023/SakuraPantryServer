import mongoose from 'mongoose';
import User from './models/UserModel.js';
import Product from './models/ProductModel.js';
import Category from './models/CategoryModel.js';
import databaseConnect from './dbConnection.js';
import Order from './models/OrderModel.js';

// Execute database connection then seed data
databaseConnect()
  .then(async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('Creating seed data');

      // Seed an admin user
      await User.collection.drop();
      let adminUser = await User.create({
        email: 'AdminUser@email.com',
        password: 'AdminUser1',
        role: 'admin'
      });

      // eslint-disable-next-line no-console
      console.log(adminUser);

      // Seed an user
      let user1 = await User.create({
        email: 'user1@email.com',
        password: 'User1',
        role: 'user'
      });

      // eslint-disable-next-line no-console
      console.log(user1);

      // Seed a category
      await Category.collection.drop();
      let category1 = await Category.create({
        name: 'Noodles',
        slug: 'noodles'
      });

      // eslint-disable-next-line no-console
      console.log(category1);

      // Seed a product
      await Product.collection.drop();
      let product1 = await Product.create({
        name: 'Ramen',
        slug: 'ramen',
        category: category1._id,
        description: 'Ramen is yummy!',
        stockQuantity: 5,
        imageUrl:
          'https://shopifull.com/wp-content/uploads/2020/04/j-basket-Japanese-ramen-noodles-800gm.jpg',
        price: '8.00',
        isFeatured: true
      });

      // eslint-disable-next-line no-console
      console.log(product1);

      // Seed an order
      await Order.collection.drop();
      let order1 = await Order.create({
        user: user1._id,
        items: {
          product: product1._id,
          quantity: 2
        },
        totalPrice: '16.00',
        paymentMethod: 'Credit Card'
      });

      // eslint-disable-next-line no-console
      console.log(order1);
    } catch (dropError) {
      // eslint-disable-next-line no-console
      console.error('Error dropping collections:', dropError);
      throw dropError;
    }
  })
  // Close the connection after completing data seeding
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
    // eslint-disable-next-line no-console
    console.error('An unexpected error occurred:', error);
  });
