const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  chargerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charger', required: true } , // Which charger was chosen
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } , // Which user booked
  date: { type: Date, required:true },
  minutes: { type: Number, required:true },
  totalPrice: { type: Number, required:true },
});

module.exports = mongoose.model('Reservation', reservationSchema);
