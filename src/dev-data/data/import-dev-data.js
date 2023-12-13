import mongoose from 'mongoose';
import fs from 'fs';
import Category from '../../models/CategoryModel.js';
import Product from '../../models/ProductModel.js';
import databaseConnect from '../../dbConnection.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));

// Function to import dev data
const importData = async () => {
  try {
    await Category.create(categories);
    await Product.create(products);
    // eslint-disable-next-line no-console
    console.log('Data successfully loaded!');
  } catch (importError) {
    // eslint-disable-next-line no-console
    console.error('Error during data import:', importError);
  }
};

// Function to delete dev data
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    // eslint-disable-next-line no-console
    console.log('Data successfully deleted!');
  } catch (deleteError) {
    // eslint-disable-next-line no-console
    console.error('Error during data deleting:', deleteError);
  }
};

// Function to connect to db then import or delete data
async function seedDatabase() {
  try {
    await databaseConnect();
    if (process.argv[2] === '--import') {
      await importData();
    } else if (process.argv[2] === '--delete') {
      await deleteData();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error occurred:', error);
  } finally {
    // Closing the database connection
    await mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.log('Database disconnected!');
  }
}

seedDatabase();
