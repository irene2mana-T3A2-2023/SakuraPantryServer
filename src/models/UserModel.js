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
  }
});

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line no-console
  console.log('About to save a user to the DB!');
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
