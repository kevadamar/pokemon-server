const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

class AuthController {
  #SECRET_KEY;
  constructor() {
    this.#SECRET_KEY = process.env.SECRET;
  }

  login = async (req, res) => {
    try {
      const payload = req.body;
      const { email, password } = payload;

      let resultUser = await User.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      if (!resultUser) {
        return res.status(401).json({
          status: 401,
          message: 'Invalid Credentials',
        });
      }

      resultUser = JSON.parse(JSON.stringify(resultUser));

      //   const isValidPassword = bcrypt.compareSync(password, resultUser.password);
      const isValidPassword = resultUser.password === password;

      if (!isValidPassword) {
        return res.status(401).json({
          status: 401,
          message: 'Invalid Credentials',
        });
      }
      const token = jwt.sign(
        {
          id: resultUser.id,
          email: resultUser.email,
          username: resultUser.username,
        },
        this.#SECRET_KEY,
      );

      res.status(200).json({
        status: 200,
        message: 'Successfully Login',
        data: {
          user: {
            email: resultUser.email,
          },
          token,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error,
      });
    }
  };

  register = async (req, res) => {
    try {
      let data = req.body;
      const { email } = data;

      const checkEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (checkEmail) {
        return res.status(400).send({
          status: 400,
          message: 'Email Already Registered',
        });
      }

      let resultCreated = await User.create(data);

      const resultFind = await User.findOne({
        where: {
          email: resultCreated.email,
        },
      });

      const token = jwt.sign(
        {
          id: resultFind.id,
          email: resultFind.email,
          username: resultFind.username,
        },
        this.#SECRET_KEY,
      );

      return res.status(200).json({
        status: 200,
        message: 'successfully registered',
        data: {
          user: {
            email: resultFind.email,
          },
          token,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error,
      });
    }
  };
}

module.exports = AuthController;
