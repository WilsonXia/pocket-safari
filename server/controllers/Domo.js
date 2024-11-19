const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  return res.render('app');
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age greeting').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving documents!' });
  }
};

const editSpeech = async (req, res) => {
  // Check if the speech edit is there
  if (!req.body.greeting) {
    return res.status(400).json({ error: 'Please enter a new greeting' })
  }
  const query = { _id: req.body.domoID };
  try {
    // Fetch the currently selected Domo and update it
    const doc = await Domo.findOneAndUpdate(query, {
      $set: { greeting: req.body.greeting },
    },
      { returnDocument: 'after', }
    ).lean().exec();
    return res.json({domo: doc});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error editing speech' });
  }
}

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  if (!req.body.greeting) {
    req.body.greeting = "Domo!";
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    greeting: req.body.greeting,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  editSpeech,
};
