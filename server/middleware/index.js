const Zoo = require('../controllers/Zoo.js');

const requiresLogin = (req, res, next) => {
  // Redirect to Login
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  // Redirect to Maker
  if (req.session.account) {
    return res.redirect('/zoo');
  }
  return next();
};

const requiresSecure = (req, res, next) => {
  // Redirect into a secure protocol
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const requiresAdmin = (req, res, next) => {
  // Redirect to App
  if (!req.session.account.isAdmin) {
    return res.redirect('/zoo');
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

const updateNewAnimals = async (req, res, next) => {
  await Zoo.updateZooAnimals(req.session.account._id);
  next();
};

module.exports = {
  requiresLogin,
  requiresLogout,
  requiresAdmin,
  updateNewAnimals,
};

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
