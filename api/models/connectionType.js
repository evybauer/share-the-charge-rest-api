const mongoose = require('mongoose');

const connectionTypeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  chargerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charger', required: true } , // Which charger was chosen
  formalName: { type: String, required:true }, // additional info from Open Source API, we may not use
  title: { type: String, required:true }
});

module.exports = mongoose.model('ConnectionType', connectionTypeSchema);
