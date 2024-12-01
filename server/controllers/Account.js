const models = require('../models');

const { Account } = models;
const Zoo = require('./Zoo.js');

const loginPage = (req, res) => res.render('login');

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

module.exports = {
  loginPage,
  logout,
  login,
  signup,
};
