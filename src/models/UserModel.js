import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    unique: false
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
  isActive: {
    type: Boolean,
    required: false,
    unique: false
  },
  dateCreated: {
    type: Date,
    required: false,
    unique: false,
    default: new Date(Date.now())
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Boolean,
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
});

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a user to the DB!');
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
