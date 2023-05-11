const mongoose = require('mongoose');
const { Schema } = require('mongoose');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 8;
const jwtCode = 'unknownCode';

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    require: false,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 4,
  },
  tokens: [
    {
      createdToken: {
        type: String,
        require: true,
      },
    },
  ],
});

userSchema.virtual('Playlist', {
  ref: 'Playlist',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.pre('save', async function (next) {
  const user = this;
  console.log(user);

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const createdToken = jwt.sign({ _id: user.id.toString() }, jwtCode);
  console.log('createdToken: ', createdToken);
  user.tokens = user.tokens.concat({ createdToken });
  await user.save();
  return createdToken;
};

const checkPassword = async (password, savedPassword) => {
  return bcrypt.compare(password, savedPassword);
};

// userSchema.statics.authUser = async (token) => {
//   try {
//     console.log('token in authUser: ', token);
//     const decoded = jwt.verify(token, jwtCode);
//     console.log('decoded value from authUser: ',decoded._id)
//     if (decoded != null) {
//       return decoded._id;
//     }
//   }
//   catch (error) {
//     return false
//   }
// };

userSchema.statics.findByCreds = async (email, password) => {
  const otherReturnObject = {
    error: 'Please check login details.',
  };

  console.log('find by creds function working');
  console.log('password: ', password);
  if (!email || !password) {
    return 'Please provide both email and password';
  }
  const user = await User.findOne({ email: email });
  console.log('user.password: ', user.password);
  console.log('user in findByCreds: ', user);
  if (!user) {
    return otherReturnObject;
  }

  const isMatch = await checkPassword(password, user.password);

  if (!isMatch) {
    return otherReturnObject;
  }
  const returnData = user.toObject();
  delete returnData.password;
  return returnData;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
