const models = require('../models');
const { Animal } = models;

const animalPage = (req, res) => {
    return res.render('animal');
};

const getAnimals = async (req, res) => {
    try {
        const docs = await Animal.find({}).lean().exec();
        return res.json({ animals: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving documents!' });
    }
};

const editAnimal = async (req, res) => {
    // Check if the edits are there
    // Editable values: Description, rarity
    if (!req.body.description && !req.body.rarity) {
        return res.status(400).json({ error: 'Please edit at least one of the forms' })
    }
    // Find change rules
    let changes = {};
    if (req.body.rarity) {
        changes.rarity = parseInt(req.body.rarity);
    }
    if (req.body.description) {
        changes.description = req.body.description;
    }

    const query = { _id: req.body.animalID };
    try {
        // Fetch the currently selected Animal and update it
        const doc = await Animal.findOneAndUpdate(query, {
            $set: changes,
        },
            { returnDocument: 'after', }
        ).lean().exec();
        return res.json({ animal: doc });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error editing decription...' });
    }
}

const makeAnimal = async (req, res) => {
    if (!req.body.name || !req.body.rarity) {
        return res.status(400).json({ error: 'Both name and rarity are required!' });
    }

    if (!req.body.description) {
        req.body.description = "This is an animal.";
    }

    const animalData = {
        name: req.body.name,
        rarity: req.body.rarity,
        description: req.body.description,
    };

    try {
        const newAnimal = new Animal(animalData);
        await newAnimal.save();
        return res.status(201).json({ name: newAnimal.name, animalID: newAnimal._id });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Animal already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making this animal!' });
    }
};

module.exports = {
    animalPage,
    makeAnimal,
    getAnimals,
    editAnimal,
};
