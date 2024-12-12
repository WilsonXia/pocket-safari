const models = require('../models');

const { Zoo, Animal } = models;

const zooPage = (req, res) => res.render('zoo', {isAdmin: req.session.account.isAdmin});

const getZoo = async (req, res) => {
  try {
    const query = { userID: req.session.account._id };
    const docs = await Zoo.findOne(query).lean().exec();
    return res.status(200).json({ zoo: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving documents!' });
  }
};

const updateZooAnimals = async (userID) => {
  try {
    const zooDoc = await Zoo.findOne({ userID }).exec(); // no lean
    const animalDocs = await Animal.find({}).lean().exec();

    animalDocs.forEach((baseAnimal) => {
      // Add base animals only if the zoo doesn't have that animal species
      if (!zooDoc.animals.find(
        (zooAnimal) => zooAnimal.animalID === baseAnimal._id.toString(),
      )) {
        zooDoc.animals.push({ animalID: baseAnimal._id, rarity: baseAnimal.rarity, description: 'Not Found yet!' });
      }
    });
    await zooDoc.save(); // update via save, must be a doc
    console.log('Updated Zoo');
    // return res.status().json({});
  } catch (err) {
    console.log(err);
    // return res.status(500).json({ error: 'An error occured updating the zoo' });
  }
};

const createZoo = async (userID) => {
  // Will be created upon successful user creation
  const zooData = {
    userID,
  };

  try {
    const newZoo = new Zoo(zooData);
    await newZoo.save();
    updateZooAnimals(userID);
    // return json({ redirect: '/maker' }); // Last step for account creation
  } catch (err) {
    console.log(err);
    // if (err.code === 11000) {
    //     // return res.status(400).json({ error: 'This zoo already exists' });
    // }
    // return res.status(500).json({ error: 'An error occured making this zoo' });
  }
};

// Add an animal into an Account's Zoo
const addZooAnimal = async (req, res) => {
  // For now, just find a random animal
  // Plan to use a different page to use an array of found animals
  // to increment the zoo's animal count
  // const body = req.body.foundAnimals
  try {
    const foundAnimals = req.body.animals;
    const query = {
      userID: req.session.account._id,
    };
    const docs = await Zoo.findOne(query).exec();
    // For each foundAnimal, find it in the docs and increment the caught number.
    foundAnimals.forEach(
      (found) => {
        const currAnimal = docs.animals.find((a) => a.animalID === found._id.toString());
        currAnimal.numCaught += 1;
        currAnimal.name = found.name;
        currAnimal.description = found.description;
      },
    );
    await docs.save();
    return res.json({ zoo: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ json: 'Error retrieving documents!' });
  }
};

module.exports = {
  zooPage,
  getZoo,
  createZoo,
  updateZooAnimals,
  addZooAnimal,
};
