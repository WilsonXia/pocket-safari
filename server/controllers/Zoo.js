const { random } = require('underscore');
const models = require('../models');

const { Zoo, Animal } = models;

const zooPage = (req, res) => res.render('zoo');

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

const createZoo = async (userID) => {
    // Will be created upon successful user creation
    const zooData = {
        userID,
    };

    try {
        const newZoo = new Zoo(zooData);
        await newZoo.save();
        updateZooAnimals(userID)
        // return json({ redirect: '/maker' }); // Last step for account creation
    } catch (err) {
        console.log(err);
        // if (err.code === 11000) {
        //     // return res.status(400).json({ error: 'This zoo already exists' });
        // }
        // return res.status(500).json({ error: 'An error occured making this zoo' });
    }
};

const updateZooAnimals = async (userID) => {
    try {
        const zooDoc = await Zoo.findOne({ userID }).exec(); // no lean
        const animalDocs = await Animal.find({}).lean().exec();

        animalDocs.forEach((baseAnimal) => {
            // Add base animals only if the zoo doesn't have that animal species
            if (!zooDoc.animals.find(
                (zooAnimal) => zooAnimal.animalID === baseAnimal._id.toString()
            )) {
                zooDoc.animals.push({ animalID: baseAnimal._id, name: baseAnimal.name });
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

// Add an animal into an Account's Zoo
const addZooAnimal = async (req, res) => {
    // For now, just find a random animal
    // Plan to use a different page to use an array of found animals
    // to increment the zoo's animal count
    // const body = req.body.foundAnimals
    try {
        const foundAnimals = await Animal.find({}).lean().exec();
        const chosenAnimal = foundAnimals[random(foundAnimals.length - 1)];
        const query = {
            userID: req.session.account._id,
        };
        const docs = await Zoo.findOne(query).exec();
        // For each foundAnimal, find it in the docs and increment the caught number.
        docs.animals.find((a) => a.animalID === chosenAnimal._id.toString())
            .numCaught += 1;
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
