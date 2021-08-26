'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PokemonUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PokemonUser.belongsTo(models.User, {
        as: 'my_pokemons_user',
        foreignKey: 'user_id',
      });
    }
  }
  PokemonUser.init(
    {
      pokemon_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      wanted_pokemon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'PokemonUser',
      tableName: 'pokemon_user',
    },
  );
  return PokemonUser;
};
