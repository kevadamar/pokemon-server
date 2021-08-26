const AuthController = require('./authController');
const PokemonController = require('./pokemonController');

const pokemon = new PokemonController();
const auth = new AuthController();

module.exports.controller = { pokemon, auth };
