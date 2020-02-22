const mongoose = require("mongoose");

const chargerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }, // Which user created

  title: { type: String, required: true },
  // chargerPhoto: { type: String }, // We can require the image or not
  costPerKWh: { type: Number, required: true },
  numberOfChargers: { type: Number, required: true, default: 1 },

  street: { type: String, required: true },
  city: { type: String, required: true },
  stateOrProvince: { type: String, required: true },
  postCode: { type: String, required: true },
  countryId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },

  generalComments: { type: String, required: true },
  typeOfCharger: { type: String, default: 'Domestic' },
  active: { type: Boolean, required: true },
  dateAvailableStart: { type: Date, required: true },
  dateAvailableEnd: { type: Date, required: true },
  hourStart: { type: Number, required: true },
  hourEnd: { type: Number, required: true },

  connectionTypeId: { type: Number, ref: "ConnectionType", required: true }, // Which connection type is the charger -- Dropdown menu
  pictureUrl: { type: String },

  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Charger", chargerSchema);