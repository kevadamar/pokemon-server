'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bid.init(
    {
      user_id: DataTypes.NUMBER,
      pokemon_id: DataTypes.NUMBER,
      bid_count: DataTypes.NUMBER,
      is_deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Bid',
      tableName: 'bid',
    },
  );
  return Bid;
};
