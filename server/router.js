const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getAnimals', mid.requiresLogin, controllers.Animal.getAnimals);
  app.post('/editSpeech', mid.requiresLogin, controllers.Domo.editSpeech);
  app.post('/editAnimal', mid.requiresLogin, controllers.Animal.editAnimal);
  app.post('/updateZoo', mid.requiresLogin, controllers.Zoo.updateZooAnimals);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

  app.get('/animal', mid.requiresLogin, mid.requiresAdmin, controllers.Animal.animalPage);
  app.post('/animal', mid.requiresLogin, mid.requiresAdmin, controllers.Animal.makeAnimal);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
