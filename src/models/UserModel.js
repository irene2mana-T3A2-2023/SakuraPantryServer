import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { filterSchema } from '../utils/common.js';
import validator from 'validator';

const Schema = mongoose.Schema;

// Define User Schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, 'Please provide your email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide your password']
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
      unique: false,
      validate: {
        validator: function (firstName) {
          const firstNameRegex = /^[a-zA-Z]{2,30}$/;
          return firstNameRegex.test(firstName);
        },
        message: 'First name must be between 2 to 30 characters and contain letters only'
      }
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
      validate: {
        validator: function (lastName) {
          const lastNameRegex = /^[a-zA-Z]{2,30}$/;
          return lastNameRegex.test(lastName);
        },
        message: 'Last name must be between 2 to 30 characters and contain letters only'
      }
    },
    phone: {
      type: String,
      required: false,
      validate: {
        validator: function (phone) {
          const lastNameRegex = /^[0-9]+$/;
          return lastNameRegex.test(phone);
        },
        message: 'Phone number can contain only numbers.'
      }
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

// Password validation logic
UserSchema.methods.isPasswordValid = function (password) {
  return /^[a-zA-Z0-9]{8,30}$/.test(password);
};

// A middleware that will automatically hash the password before it’s saved to the database
UserSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Define an instance method on UserSchema
UserSchema.method({
  // comparePassword is used to compare the provided password with the hashed password stored in the database.
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
});

// Define User Model
const User = mongoose.model('User', UserSchema);

export default User;
