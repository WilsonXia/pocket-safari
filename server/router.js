const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getAnimals', mid.requiresLogin, controllers.Animal.getAnimals);
  app.get('/getZoo', mid.requiresLogin, controllers.Zoo.getZoo);
  app.post('/editAnimal', mid.requiresLogin, controllers.Animal.editAnimal);
  app.post('/addZooAnimal', mid.requiresLogin, controllers.Zoo.addZooAnimal);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/animal', mid.requiresLogin, mid.requiresAdmin, controllers.Animal.animalPage);
  app.post('/animal', mid.requiresLogin, mid.requiresAdmin, controllers.Animal.makeAnimal);

  app.get('/zoo', mid.requiresLogin, controllers.Zoo.zooPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
