
const { Bid, PokemonUser } = require('../models/');
const { services } = require('../services');

class PokemonController {
  #pokemonService;

  constructor() {
    this.#pokemonService = services.pokemon;
  }

  getAllPokemon = async (req, res, next) => {
    try {
      const page = req.query.page;
      const limit = 20;
      let offset = 0;
      if (page > 1) {
        offset = (page - 1) * limit;
      }

      const { data, status, message, error } =
        await this.#pokemonService.getAllPokemon(offset, limit);

      if (error) {
        return res.status(status).json({
          status,
          message,
          data: null,
        });
      }

      res.status(status).json({
        status,
        message,
        data,
      });
    } catch (error) {
      console.log('error from controller ; ', error);

      res.status(500).json({
        status: 500,
        message: 'Internal Server Error!',
        data: null,
      });
    }
  };

  getPokemon = async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data, status, message, error } =
        await this.#pokemonService.getPokemon(id, req.user);

      if (error) {
        return res.status(status).json({
          status: status,
          message,
          data: null,
        });
      }

      res.status(status).json({
        status,
        message,
        data,
      });
    } catch (error) {
      console.log('error from controller ; ', error);

      res.status(500).json({
        status: 500,
        message: 'Internal Server Error!',
        data: null,
      });
    }
  };

  getAllMyPokemon = async (req, res, next) => {
    try {
      const user = req.user;

      const { data, status, message, error } =
        await this.#pokemonService.getAllMyPokemon(user.id);

      if (error) {
        return res.status(status).json({
          status,
          message,
          data: null,
        });
      }

      res.status(status).json({
        status,
        message,
        data,
      });
    } catch (error) {
      console.log('error from controller ; ', error);

      res.status(500).json({
        status: 500,
        message: 'Internal Server Error!',
        data: null,
      });
    }
  };

  getMyPokemon = async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data, status, message, error } =
        await this.#pokemonService.getMyPokemon(id);

      if (error) {
        return res.status(status).json({
          status: status,
          message,
          data: null,
        });
      }

      res.status(status).json({
        status,
        message,
        data,
      });
    } catch (error) {
      console.log('error from controller ; ', error);

      res.status(500).json({
        status: 500,
        message: 'Internal Server Error!',
        data: null,
      });
    }
  };

  bidPokemon = async (req, res, next) => {
    try {
      const pokemon_id = req.params.pokemon_id;
      const user_id = req.user.id;

      let resultBid = await Bid.findAll({
        where: {
          pokemon_id,
          is_deleted: false,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'is_deleted'],
        },
      });

      if (resultBid.length === 0) {
        await Bid.create({
          pokemon_id,
          user_id,
          is_deleted: false,
          bid_count: 1,
        });

        return res.status(200).json({
          status: 200,
          message: 'Coba 3x untuk mendapatkannya!',
        });
      }

      resultBid = JSON.parse(JSON.stringify(resultBid));

      let currBidCount = await Bid.findOne({
        where: {
          pokemon_id,
          user_id,
          is_deleted: false,
        },
      });

      if (!currBidCount) {
        await Bid.create({
          pokemon_id,
          user_id,
          is_deleted: false,
          bid_count: 1,
        });

        return res.status(200).json({
          status: 200,
          message: 'Coba 3x untuk mendapatkannya!',
        });
      }

      let bidGetCount = false;

      resultBid.forEach((bid) => {
        if (bid.bid_count === 4) {
          bidGetCount = true;
          if (bid.user_id === user_id) {
            return res.status(200).json({
              status: 200,
              message: 'Pokemon sudah kamu dapatkan silahkan cek my pokemon mu',
            });
          }
        }
      });

      if (bidGetCount) {
        return res.status(200).json({
          status: 200,
          message: 'Pokemon sudah didapatkan user lain',
        });
      }

      currBidCount = JSON.parse(JSON.stringify(currBidCount));
      if (currBidCount.bid_count < 4) {
        await Bid.update(
          {
            bid_count: currBidCount.bid_count + 1,
          },
          { where: { user_id, pokemon_id } },
        );
      }
      const calculateBid = 4 - (currBidCount.bid_count + 1);
      let message = `Coba ${calculateBid}x untuk mendapatkannya!`;

      if (calculateBid === 0) {
        message =
          'Selamat Pokemon telah di dapatkan. silahkan cek my pokemon mu';

        await PokemonUser.create({
          pokemon_id: currBidCount.pokemon_id,
          user_id: currBidCount.user_id,
        });
      }

      return res.status(200).json({
        status: 200,
        message,
      });
    } catch (error) {
      console.log('error from controller ; ', error);
      res.status(500).json({
        errors: 'Internal server error',
      });
    }
  };

  getAllExchange = async (req, res, next) => {
    try {
      const user = req.user;

      const { data, status, message, error } =
        await this.#pokemonService.getAllExchangePokemon(user.id);

      if (error) {
        return res.status(status).json({
          status,
          message,
          data: null,
        });
      }

      res.status(status).json({
        status,
        message,
        data,
      });
    } catch (error) {
      console.log('error from controller ; ', error);
      res.status(500).json({
        errors: 'Internal server error',
      });
    }
  };
}

module.exports = PokemonController;
