const models = require('../models');

const { Account } = models;
const Zoo = require('./Zoo.js');

const loginPage = (req, res) => res.render('login');

const settingsPage = (req, res) => res.render('settings');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // First validate data
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    // Update the Zoo
    Zoo.updateZooAnimals(account._id);

    return res.json({ redirect: '/zoo' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // First validate data
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Password Checks
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    // Create the zoo after making an account
    await Zoo.createZoo(newAccount._id);
    // // Update the zoo
    // await Zoo.updateZooAnimals(newAccount._id);
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.status(201).json({ redirect: '/zoo' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePass = async (req, res) => {
  const currPass = `${req.body.currentPass}`;
  const newPass = `${req.body.newPass}`;

  // First validate data
  if (!currPass || !newPass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Password Checks
  try {
    const newHash = await Account.generateHash(newPass);
    // Try and authenticate with the current password
    return Account.authenticate(req.session.account.username, currPass, async (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Wrong password!' });
      }
      // newHash => account password
      account.password = newHash;
      // save
      await account.save();
      return res.json({ message: 'Password successfully changed' });
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
}

const getAdmin = async (req, res) => {
  // Return bool
  try {
    // Fetch for the Account
    const doc = await Account.findOne({ username: req.session.account.username })
    .lean().exec();
    return res.status(200).json({isAdmin: doc.isAdmin});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error has occured!' });
  }
}

const toggleAdmin = async (req, res) => {
  // Get the body
  const { isAdmin } = req.body;
  // Try Catch, get current Account and change admin accordingly
  try {
    // Fetch for the Account
    await Account.findOneAndUpdate({ username: req.session.account.username },
      { $set: { isAdmin } }
    ).lean().exec();
    return res.status(200).json({message: 'Admin access changed'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error has occured!' });
  }
}

module.exports = {
  loginPage,
  settingsPage,
  logout,
  login,
  signup,
  changePass,
  getAdmin,
  toggleAdmin,
};
