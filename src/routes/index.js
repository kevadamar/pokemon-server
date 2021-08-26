const router = require('express').Router();
const { controller } = require('../controller');
const { middleware } = require('../middleware');

router.get('/pokemon', controller.pokemon.getAllPokemon);
router.get(
  '/pokemon/:id/detail',
  middleware.auth.authentication,
  controller.pokemon.getPokemon,
);
router.get(
  '/pokemon/user',
  middleware.auth.authentication,
  controller.pokemon.getAllMyPokemon,
);
router.get(
  '/pokemon/user/:id/detail',
  middleware.auth.authentication,
  controller.pokemon.getMyPokemon,
);
router.get(
  '/pokemon/:pokemon_id/bid',
  middleware.auth.authentication,
  controller.pokemon.bidPokemon,
);

router.get(
  '/exchange',
  middleware.auth.authentication,
  controller.pokemon.getAllExchange,
);

router.post('/login', controller.auth.login);
router.post('/register', controller.auth.register);

module.exports = router;
