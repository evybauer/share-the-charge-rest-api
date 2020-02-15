const mongoose = require('mongoose');

const chargerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required:true },
  cost_per_charge: { type: Number, required:true },
  chargerPhoto: { type: String, required: true } // We can require the image or not
});

module.exports = mongoose.model('Charger', chargerSchema);