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
      required: [true, 'Please provide your password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      // need to validate password in back-end?
      validate: {
        validator: function (password) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(password);
        },
        message: 'Password must include at least one uppercase letter, one lowercase letter, one digit and one special character.'
      }
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
          const firstNameRegex =
            /^[a-zA-Z ]+$/;
          return firstNameRegex.test(firstName);
        },
        message: 'First name can contain only letters and space.'
      }
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
      validate: {
        validator: function (lastName) {
          const lastNameRegex =
            /^[a-zA-Z ]+$/;
          return lastNameRegex.test(lastName);
        },
        message: 'Last name can contain only letters and space.'
      }
    },
    phone: {
      type: String,
      required: false,
      validate: {
        validator: function (phone) {
          const lastNameRegex =
            /^[0-9]+$/;
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

// Not sure this have been done and whether it should be done here
// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// A Mongoose middleware that will automatically hash the password before it’s saved to the database

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
