import databaseConnect from '../../dbConnection.js';
// import Category from '../../models/CategoryModel.js';
import Product from '../../models/ProductModel.js';

// Function to get all products belong to a category
// This is to test if the id reference between categories and products is working
const readData = async () => {
  await databaseConnect();
  const categoryId = '657046215ed01f56e0a4e00a'; // replace this with different _id in categories.json to test

  try {
    const products = await Product.find({ category: categoryId }).exec();
    // eslint-disable-next-line no-console
    console.log('Result:', products);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('An error has occured:', err);
  }
  process.exit();
};

readData();
