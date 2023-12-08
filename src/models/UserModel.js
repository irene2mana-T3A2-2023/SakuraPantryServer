import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { filterSchema } from '../utils/common.js';

const Schema = mongoose.Schema;

// Define User Schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      unique: false,
      enum: ['admin', 'user'],
      default: 'user'
    },
    firstName: {
      type: String,
      required: true,
      unique: false
    },
    lastName: {
      type: String,
      required: true,
      unique: false
    },
    // phone should be unique, but it will throw duplicate error if there's no value provided regardless null value
    // solution: validate the uniqueness of phone in application logic or front-end
    phone: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    resetPasswordToken: {
      type: String,
      required: false
    },
    resetPasswordExpires: {
      type: Date,
      required: false
    },
    address: {
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
  {
    // Enable automatic timestamps for creation and updates
    timestamps: true,
    // Apply filterSchema to transform the JSON output of the schema
    toJSON: filterSchema(['__v', '_id', 'password'])
  }
);

// Define an instance method on UserSchema
UserSchema.method({
  // comparePassword is used to compare the provided password with the hashed password stored in the database.
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
});

// This middleware is to perform some logic or actions before saving the document.
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a user to the DB!');
  next();
});

// Define User Model
const User = mongoose.model('User', UserSchema);

export default User;
