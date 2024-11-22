const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  animalID: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
    set: setName,
  },
  rarity: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

AnimalSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  animalID: doc.animalID,
});

const AnimalModel = mongoose.model('Animal', AnimalSchema);
module.exports = AnimalModel;