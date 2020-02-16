const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, unique: true, required: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
  password: { type: String, required: true },
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  dateOfBirth: { type: Date, required: true},
  phoneNumber: { type: Number, required: true},
  creditCardNumber: { type: Number, required: true},
  creditCardExpirationDate: { type: Date, required: true},
  creditCardCvv: { type: Number, required: true}
});

module.exports = mongoose.model('User', userSchema);
