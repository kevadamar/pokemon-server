const { default: axios } = require('axios');
const { PokemonUser, User, Bid } = require('../models');
const { Op } = require('sequelize');

class PokemonService {
  #BASE_URL_API_POKEMON_PUBLIC;

  constructor() {
    this.#BASE_URL_API_POKEMON_PUBLIC = process.env.PUBLIC_API_POKEMON;
  }

  getAllPokemon = async (offset, limit) => {
    try {
      const error = false;

      const resultApiAllPokemon = await axios.get(
        `${
          this.#BASE_URL_API_POKEMON_PUBLIC
        }pokemon?offset=${offset}&limit=${limit}`,
      );

      if (resultApiAllPokemon?.status !== 200) {
        return {
          data: null,
          status,
          message: 'Error get all pokemon from server.',
          error: !error,
        };
      }

      let resApiFetch = resultApiAllPokemon?.data?.results?.map(
        async (pokemon) => await this.#getDetailPokemon(pokemon.name, false),
      );

      let resultPromiseDetailPokemon = await Promise.all(resApiFetch);

      const resultApiDetailPokemon = [];
      for (let index = 0; index < resultPromiseDetailPokemon.length; index++) {
        const {
          data,
          status,
          error: errorDetail,
        } = resultPromiseDetailPokemon[index];

        if (errorDetail) {
          return {
            data: null,
            status,
            message: 'Error get detail from server.',
            error: !error,
          };
        }

        resultApiDetailPokemon.push({
          id: data.id,
          name: data.name,
          image: data.sprites.other.dream_world.front_default,
          types: data.types.map((typePokemon) => ({
            name: typePokemon.type.name,
          })),
        });
      }

      return {
        data: resultApiDetailPokemon,
        status: 200,
        message: 'Successfully',
        error,
      };
    } catch (error) {
      console.log('error from service', error);
      return {
        data: null,
        status: 500,
        message: error,
        error: true,
      };
    }
  };

  getPokemon = async (id, user) => {
    try {
      const error = false;
      let is_hidden = false;
      let user_id = 0;

      let {
        data,
        status,
        error: errorDetail,
      } = await this.#getDetailPokemon(id, true);

      if (errorDetail) {
        return {
          data: null,
          status,
          message: 'Error get detail from server.',
          error: !error,
        };
      }

      let checkBidPokemon = await Bid.findAll({
        where: { pokemon_id: data.id },
      });

      checkBidPokemon = JSON.parse(JSON.stringify(checkBidPokemon));
      checkBidPokemon.forEach((bid) => {
        if (bid.bid_count === 4) {
          is_hidden = true;
          user_id = bid.user_id;
        }
      });

      data = {
        id: data.id,
        name: data.name,
        abilities: data.abilities.map((abilityPokemon) => ({
          name: abilityPokemon.ability.name,
        })),
        is_hidden,
        is_user:
          user_id === user.id
            ? 'Pokemon sudah kamu dapatkan silahkan cek my pokemon mu'
            : 'Pokemon Sudah didapatkan user lain',
        image: data.sprites.other.dream_world.front_default,
        height: data.height,
        types: data.types.map((typePokemon) => ({
          name: typePokemon.type.name,
        })),
        weight: data.weight,
      };

      return {
        data,
        status,
        message: 'Successfully',
        error,
      };
    } catch (error) {
      console.log('error from service', error);
      return {
        data: null,
        status: 500,
        message: error,
        error: true,
      };
    }
  };

  getAllMyPokemon = async (user_id) => {
    try {
      const error = false;

      let resultMyPokemon = await PokemonUser.findAll({
        where: {
          user_id,
        },
        attributes: ['pokemon_id', 'user_id'],
      });

      resultMyPokemon = JSON.parse(JSON.stringify(resultMyPokemon));

      const resultDetailPokemon = resultMyPokemon.map(
        async (pokemon) =>
          await this.#getDetailPokemon(pokemon.pokemon_id, true),
      );

      const resultPromiseDetailPokemon = await Promise.all(resultDetailPokemon);

      const resultApiDetailPokemon = [];
      for (let index = 0; index < resultPromiseDetailPokemon.length; index++) {
        const {
          data,
          status,
          error: errorDetail,
        } = resultPromiseDetailPokemon[index];

        if (errorDetail) {
          return {
            data: null,
            status,
            message: 'Error get detail from server.',
            error: !error,
          };
        }

        resultApiDetailPokemon.push({
          id: data.id,
          name: data.name,
          image: data.sprites.other.dream_world.front_default,
          types: data.types.map((typePokemon) => ({
            name: typePokemon.type.name,
          })),
        });
      }

      return {
        data: resultApiDetailPokemon,
        status: 200,
        message: 'Successfully',
        error,
      };
    } catch (error) {
      console.log('error from service', error);
      return {
        data: null,
        status: 500,
        message: error,
        error: true,
      };
    }
  };
  getAllExchangePokemon = async (user_id) => {
    try {
      const error = false;

      let resultMyPokemon = await PokemonUser.findAll({
        where: {
          user_id: { [Op.ne]: user_id },
          wanted_pokemon: { [Op.ne]: null },
        },
        attributes: ['pokemon_id', 'user_id'],
      });

      resultMyPokemon = JSON.parse(JSON.stringify(resultMyPokemon));

      const resultDetailPokemon = resultMyPokemon.map(
        async (pokemon) =>
          await this.#getDetailPokemon(pokemon.pokemon_id, true),
      );

      const resultPromiseDetailPokemon = await Promise.all(resultDetailPokemon);

      const resultApiDetailPokemon = [];
      for (let index = 0; index < resultPromiseDetailPokemon.length; index++) {
        const {
          data,
          status,
          error: errorDetail,
        } = resultPromiseDetailPokemon[index];

        if (errorDetail) {
          return {
            data: null,
            status,
            message: 'Error get detail from server.',
            error: !error,
          };
        }

        resultApiDetailPokemon.push({
          id: data.id,
          name: data.name,
          image: data.sprites.other.dream_world.front_default,
          types: data.types.map((typePokemon) => ({
            name: typePokemon.type.name,
          })),
        });
      }

      return {
        data: resultApiDetailPokemon,
        status: 200,
        message: 'Successfully',
        error,
      };
    } catch (error) {
      console.log('error from service', error);
      return {
        data: null,
        status: 500,
        message: error,
        error: true,
      };
    }
  };

  getMyPokemon = async (id) => {
    try {
      const error = false;

      let checkFoundMyPokemon = await PokemonUser.findOne({
        where: { pokemon_id: id },
        include: [
          {
            model: User,
            as: 'my_pokemons_user',
            attributes: ['username'],
          },
        ],
        attributes: ['pokemon_id'],
      });

      if (!checkFoundMyPokemon) {
        return {
          data: null,
          status: 404,
          message: 'Sorry. Your Pokemon Not Found',
          error: !error,
        };
      }

      let {
        data,
        status,
        error: errorDetail,
      } = await this.#getDetailPokemon(id, true);

      if (errorDetail) {
        return {
          data: null,
          status,
          message: 'Error get detail from server.',
          error: !error,
        };
      }

      checkFoundMyPokemon = JSON.parse(JSON.stringify(checkFoundMyPokemon));

      data = {
        id: data.id,
        name: data.name,
        user: checkFoundMyPokemon.my_pokemons_user,
        abilities: data.abilities.map((abilityPokemon) => ({
          name: abilityPokemon.ability.name,
        })),
        image: data.sprites.other.dream_world.front_default,
        height: data.height,
        types: data.types.map((typePokemon) => ({
          name: typePokemon.type.name,
        })),
        weight: data.weight,
      };

      return {
        data,
        status,
        message: 'Successfully',
        error,
      };
    } catch (error) {
      console.log('error from service', error);
      return {
        data: null,
        status: 500,
        message: error,
        error: true,
      };
    }
  };

  // get detail pokemon function helper
  #getDetailPokemon = async (param, isDetail) => {
    try {
      let error = false;

      const { data, status } = await axios.get(
        `${this.#BASE_URL_API_POKEMON_PUBLIC}pokemon/${param}`,
      );

      if (status !== 200) {
        error = true;
        return { data, status, error };
      }

      if (isDetail) {
        return { data, status, error };
      }

      return { data, status, error };
    } catch (error) {
      console.log('error from service detail', error);
      return {
        data: null,
        status: 500,
        message: error,
        error: true,
      };
    }
  };
}

module.exports = PokemonService;
