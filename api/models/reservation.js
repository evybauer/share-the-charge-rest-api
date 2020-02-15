const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  charger: { type: mongoose.Schema.Types.ObjectId, ref: 'Charger', required: true } , // Which charger was chosen
  date: { type: Date, required:true },
  minutes: { type: Number, required:true },
  total_price: { type: Number, required:true },
  // cost_per_minute: { type: Number, ref: 'Charger'}
});

module.exports = mongoose.model('Reservation', reservationSchema);