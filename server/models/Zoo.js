const mongoose = require('mongoose');

const ZooAnimalSchema = new mongoose.Schema({
  animalID: {
    type: String,
    required: true,
  },
  numCaught: {
    type: Number,
    default: 0,
  },
  // The rest of these will be set the moment it is acquired
  name: {
    type: String,
    default: '???',
  },
  description: {
    type: String,
    default: 'Not Yet Found',
  },
  rarity: {
    type: Number,
  },
});

const ZooSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  animals: {
    type: [ZooAnimalSchema],
    default: [],
  },
});
// Will be created upon making a new account
// Hooks UserID with the Account's ID
// Sets up animals by gathering all animals

const ZooModel = mongoose.model('Zoo', ZooSchema);
module.exports = ZooModel;
