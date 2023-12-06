import mongoose from 'mongoose';
// import { envConfig } from '../../configs/env';
import fs from 'fs';
import Category from '../../models/CategoryModel.js';
import databaseConnect from '../../dbConnection.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// databaseConnect()
//   .then(async () => {
//     // Read JSON file
//     const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));

//     // Import data into database
//     const importData = async () => {
//       try {
//         await Category.create(categories);
//         // eslint-disable-next-line no-console
//         console.log('Data successfully loaded!');
//       } catch (importError) {
//         // eslint-disable-next-line no-console
//         console.log(importError);
//       }
//       //process.exit();
//     };

//     // Delete all data from collections
//     const deleteData = async () => {
//       try {
//         await Category.deleteMany();
//         // eslint-disable-next-line no-console
//         console.log('Data successfully deleted!');
//       } catch (deleteError) {
//         // eslint-disable-next-line no-console
//         console.log(deleteError);
//       }
//       //process.exit();
//     };

//     // if (process.argv[2] === '--import') {
//     //   importData();
//     // } else if (process.argv[2] === '--delete') {
//     //   deleteData();
//     // }
//     importData();
//   })
//   .then(async () => {
//     try {
//       await mongoose.connection.close();
//       // eslint-disable-next-line no-console
//       console.log('Database disconnected!');
//     } catch (disconnectError) {
//       // eslint-disable-next-line no-console
//       console.error('Error disconnecting from the database:', disconnectError);
//     }
//   })
//   .catch((error) => {
//     // eslint-disable-next-line no-console
//     console.error('An unexpected error occurred:', error);
//   });

const importData = async () => {

  const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));

  try {
    await Category.create(categories);
    // eslint-disable-next-line no-console
    console.log('Data successfully loaded!');
  } catch (importError) {
    // eslint-disable-next-line no-console
    console.error('Error during data import:', importError);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    // eslint-disable-next-line no-console
    console.log('Data successfully deleted!');
  } catch (deleteError) {
    // eslint-disable-next-line no-console
    console.log(deleteError);
  }
  process.exit();
};

// databaseConnect()
//   .then(async () => {
//     try {
//       if (process.argv[2] === '--import') {
//         importData();
//       } else if (process.argv[2] === '--delete') {
//         deleteData();
//       }
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.error('Error occurred:', error);
//     }
//   })
//   .then(async () => {
//     try {
//       await mongoose.connection.close();
//       // eslint-disable-next-line no-console
//       console.log('Database disconnected!');
//     } catch (disconnectError) {
//       // eslint-disable-next-line no-console
//       console.error('Error disconnecting from the database:', disconnectError);
//     }
//   })
//   .catch((error) => {
//     // eslint-disable-next-line no-console
//     console.error('An unexpected error occurred:', error);
//   });

const importFunction = async () => {
    await databaseConnect();
    if (process.argv[2] === '--import') {
      importData();
    } else if (process.argv[2] === '--delete') {
      deleteData();
    }
};

importFunction();
