const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  passwordOrg: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'email',
  },
});

const PasswordSchema = mongoose.model('PasswordSchema', userSchema);

module.exports = PasswordSchema;
