import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: false
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
      required: false,
      unique: false
    },
    lastName: {
      type: String,
      required: false,
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
      required: false,
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
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a user to the DB!');
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
